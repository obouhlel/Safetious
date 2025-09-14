# Clean Architecture pour l'API Safetious

## 🏗️ Vue d'ensemble

Cette API suit les principes de **Clean Architecture** avec **Hono** comme framework web. L'architecture est organisée en couches distinctes avec des responsabilités clairement définies.

## 📁 Structure des dossiers

```
src/
├── app.ts                    # Configuration principale de Hono
├── index.ts                  # Point d'entrée du serveur
├── config/                   # Configuration de l'application
│   └── env.ts               # Validation des variables d'environnement
├── controllers/              # Contrôleurs (gestion des requêtes HTTP)
│   ├── base.controller.ts   # Classe de base pour tous les contrôleurs
│   └── index.ts
├── services/                 # Logique métier
│   ├── base.service.ts      # Classe de base pour tous les services
│   └── index.ts
├── repositories/             # Accès aux données
│   ├── base.repository.ts   # Classe de base pour tous les repositories
│   └── index.ts
├── routes/                   # Définition des routes
│   └── index.ts
├── middleware/               # Middlewares personnalisés
│   └── database.middleware.ts
├── types/                    # Types TypeScript
│   └── index.ts
├── utils/                    # Utilitaires
│   └── index.ts
└── db/                       # Configuration base de données
    ├── index.ts
    └── schemas/
```

## 🎯 Principes de l'architecture

### 1. **Séparation des responsabilités**

Chaque couche a une responsabilité spécifique :

- **Routes** : Définition des endpoints
- **Controllers** : Gestion des requêtes/réponses HTTP
- **Services** : Logique métier
- **Repositories** : Accès aux données

### 2. **Inversion des dépendances**

Les couches hautes ne dépendent pas des couches basses. Les dépendances sont injectées via les constructeurs.

### 3. **Réutilisabilité**

Classes de base pour éviter la duplication de code et garantir la cohérence.

## 🔄 Flux de données

```
Request → Route → Controller → Service → Repository → Database
                    ↓
Response ← Controller ← Service ← Repository ← Database
```

## 📝 Guide d'implémentation

### Étape 1 : Créer un schéma de base de données

```typescript
// src/db/schemas/posts.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);

export type Post = z.infer<typeof selectPostSchema>;
export type NewPost = z.infer<typeof insertPostSchema>;
```

### Étape 2 : Créer le Repository

```typescript
// src/repositories/posts.repository.ts
import { eq } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { posts } from '@/db/schemas/posts';
import type { Post, NewPost } from '@/db/schemas/posts';

export class PostsRepository extends BaseRepository {
  async findAll(): Promise<Post[]> {
    try {
      return await this.db.select().from(posts);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: string): Promise<Post | null> {
    try {
      const result = await this.db.select().from(posts).where(eq(posts.id, id));
      return result[0] || null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(
    postData: Omit<NewPost, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Post> {
    try {
      const result = await this.db.insert(posts).values(postData).returning();
      return result[0];
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: string,
    postData: Partial<Omit<NewPost, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Post | null> {
    try {
      const result = await this.db
        .update(posts)
        .set({ ...postData, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning();
      return result[0] || null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.db.delete(posts).where(eq(posts.id, id));
      return result.rowCount > 0;
    } catch (error) {
      this.handleError(error);
    }
  }
}
```

### Étape 3 : Créer le Service

```typescript
// src/services/posts.service.ts
import { BaseService } from './base.service';
import { PostsRepository } from '@/repositories/posts.repository';
import { insertPostSchema } from '@/db/schemas/posts';
import type { Database } from '@/db';
import type { ApiResponse } from '@/types';
import type { Post } from '@/db/schemas/posts';

export class PostsService extends BaseService {
  async getAllPosts(db: Database): Promise<ApiResponse<Post[]>> {
    try {
      const repository = new PostsRepository(db);
      const posts = await repository.findAll();

      return this.createSuccessResponse(posts, 'Posts retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPostById(
    db: Database,
    id: string
  ): Promise<ApiResponse<Post | null>> {
    try {
      const repository = new PostsRepository(db);
      const post = await repository.findById(id);

      if (!post) {
        return this.createErrorResponse('Post not found');
      }

      return this.createSuccessResponse(post, 'Post retrieved successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createPost(
    db: Database,
    postData: unknown
  ): Promise<ApiResponse<Post>> {
    try {
      // Validation des données avec Zod
      const validationResult = insertPostSchema.safeParse(postData);

      if (!validationResult.success) {
        return this.createErrorResponse(
          'Invalid post data',
          validationResult.error.errors.map(err => err.message)
        );
      }

      const repository = new PostsRepository(db);
      const newPost = await repository.create(validationResult.data);

      return this.createSuccessResponse(newPost, 'Post created successfully');
    } catch (error) {
      return this.handleError(error);
    }
  }
}
```

### Étape 4 : Créer le Controller

```typescript
// src/controllers/posts.controller.ts
import type { Context } from 'hono';
import { BaseController } from './base.controller';
import { PostsService } from '@/services/posts.service';

export class PostsController extends BaseController {
  private postsService: PostsService;

  constructor() {
    super();
    this.postsService = new PostsService();
  }

  async getAllPosts(c: Context) {
    try {
      const db = c.get('db');
      const response = await this.postsService.getAllPosts(db);

      if (response.success) {
        return this.sendSuccess(c, response.data, response.message);
      } else {
        return this.sendError(
          c,
          response.message || 'Failed to fetch posts',
          response.errors
        );
      }
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  async getPostById(c: Context) {
    try {
      const db = c.get('db');
      const id = c.req.param('id');

      if (!id) {
        return this.sendError(c, 'Post ID is required', undefined, 400);
      }

      const response = await this.postsService.getPostById(db, id);

      if (response.success) {
        return this.sendSuccess(c, response.data, response.message);
      } else {
        return this.sendError(
          c,
          response.message || 'Post not found',
          response.errors,
          404
        );
      }
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  async createPost(c: Context) {
    try {
      const db = c.get('db');
      const body = await c.req.json();

      const response = await this.postsService.createPost(db, body);

      if (response.success) {
        return this.sendSuccess(c, response.data, response.message, 201);
      } else {
        return this.sendError(
          c,
          response.message || 'Failed to create post',
          response.errors,
          400
        );
      }
    } catch (error) {
      return this.handleError(c, error);
    }
  }
}
```

### Étape 5 : Créer les Routes

```typescript
// src/routes/posts.routes.ts
import { Hono } from 'hono';
import { PostsController } from '@/controllers/posts.controller';

export const postsRoutes = new Hono();
const postsController = new PostsController();

// GET /api/posts - Récupérer tous les posts
postsRoutes.get('/', c => postsController.getAllPosts(c));

// GET /api/posts/:id - Récupérer un post par ID
postsRoutes.get('/:id', c => postsController.getPostById(c));

// POST /api/posts - Créer un nouveau post
postsRoutes.post('/', c => postsController.createPost(c));
```

### Étape 6 : Ajouter les routes à l'application

```typescript
// src/routes/index.ts
import { Hono } from 'hono';
import { postsRoutes } from './posts.routes';

export const apiRoutes = new Hono();

// Health check route
apiRoutes.get('/health', c => {
  return c.json({
    service: 'Safetious API',
    timestamp: new Date().toISOString(),
    status: 'ok',
  });
});

// Ajouter les routes posts
apiRoutes.route('/posts', postsRoutes);
```

## 🔥 Avantages de cette architecture

### ✅ **Maintenabilité**

- Code organisé et structuré
- Responsabilités clairement définies
- Facile à déboguer et modifier

### ✅ **Testabilité**

- Chaque couche peut être testée indépendamment
- Injection de dépendances facilite le mocking
- Tests unitaires plus simples

### ✅ **Scalabilité**

- Structure modulaire
- Ajout de nouvelles fonctionnalités facilité
- Code réutilisable

### ✅ **Séparation des préoccupations**

- Logique métier séparée de l'infrastructure
- Validation centralisée
- Gestion d'erreurs cohérente

## 🛠️ Bonnes pratiques

### 1. **Validation des données**

- Utilisez Zod pour valider les entrées
- Validez au niveau du service, pas du controller

### 2. **Gestion d'erreurs**

- Utilisez les méthodes des classes de base
- Loggez les erreurs pour le débogage
- Retournez des réponses cohérentes

### 3. **Types TypeScript**

- Définissez des interfaces claires
- Utilisez les types générés par Drizzle
- Évitez `any` autant que possible

### 4. **Injection de dépendances**

- Injectez la database via le middleware
- Évitez les dépendances hardcodées
- Facilitez les tests avec des mocks

## 🚀 Pour ajouter une nouvelle route

1. **Créez le schéma** dans `src/db/schemas/`
2. **Créez le repository** dans `src/repositories/`
3. **Créez le service** dans `src/services/`
4. **Créez le controller** dans `src/controllers/`
5. **Créez les routes** dans `src/routes/`
6. **Ajoutez les routes** à `src/routes/index.ts`

Cette architecture vous permet d'ajouter rapidement de nouvelles fonctionnalités tout en maintenant un code propre et maintenable !
