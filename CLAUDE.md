# Safetious Project

This is a TypeScript monorepo built with **Bun** as the primary runtime and package manager.

## 🏗️ Project Structure

```
Safetious/
├── apps/                    # Applications
│   ├── api/                # Backend API (Bun + Hono)
│   ├── web/                # Web frontend (React + Vite)
│   └── mobile/             # Mobile app (React Native + Expo)
├── packages/               # Shared packages
│   └── shared/             # Shared utilities and types
├── tools/                  # Development tools
│   └── cli/                # CLI tool (Rust)
├── .husky/                 # Git hooks
├── eslint.config.js        # ESLint configuration (flat config)
├── .prettierrc             # Prettier configuration
├── .lintstagedrc.json      # Lint-staged configuration
├── tsconfig.json           # Base TypeScript configuration
└── package.json            # Root workspace configuration
```

## 🚀 Runtime & Package Manager

**Default to using Bun instead of Node.js:**

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv

## 📦 Scripts & Commands

### Development

```bash
# Start all apps in development mode
bun run dev

# Start specific apps
bun run dev:api      # API server
bun run dev:web      # Web frontend
bun run dev:mobile   # Mobile app (Expo)
```

### Build & Production

```bash
# Build all apps
bun run build

# Build specific apps
bun run build:api    # Build API
bun run build:web    # Build web frontend
```

### Code Quality

```bash
# Run full quality check (format + lint + type-check)
bun run quality

# Auto-fix formatting and linting issues
bun run quality:fix

# Individual checks
bun run format       # Format all files with Prettier
bun run format:check # Check formatting
bun run lint         # Lint all apps
bun run lint:fix     # Auto-fix linting issues
bun run type-check   # Run TypeScript type checking
```

### Database (API)

```bash
bun run db:setup     # Setup database
bun run db:migrate   # Run database migrations
```

### CLI Tool

```bash
bun run cli:build    # Build Rust CLI tool
bun run cli:install  # Install CLI tool
```

## 🛠️ APIs & Libraries

### Bun APIs (Preferred)

- `Bun.serve()` - HTTP server with WebSocket, HTTPS, and routing support. Don't use `express`
- `bun:sqlite` - SQLite database. Don't use `better-sqlite3`
- `Bun.redis` - Redis client. Don't use `ioredis`
- `Bun.sql` - PostgreSQL client. Don't use `pg` or `postgres.js`
- `WebSocket` - Built-in WebSocket support. Don't use `ws`
- `Bun.file` - File system operations. Prefer over `node:fs`'s readFile/writeFile
- `Bun.$` - Shell commands. Use instead of `execa`

### Testing

Use `bun test` to run tests:

```ts
import { test, expect } from 'bun:test';

test('hello world', () => {
  expect(1).toBe(1);
});
```

## 🎨 Code Quality & Formatting

### ESLint Configuration

- **Modern flat config** (`eslint.config.js`)
- **Environment-specific rules:**
  - Web: React + TypeScript + browser globals
  - API: Node.js + TypeScript + Bun globals
  - Mobile: React Native + TypeScript + Expo

### Prettier Configuration

- **Centralized formatting** (`.prettierrc`)
- **Consistent code style** across all apps
- **Auto-formatting** on save and pre-commit

### TypeScript Configuration

- **Strict mode enabled** for all projects
- **Path mapping** configured (`@/*` aliases)
- **Environment-specific configs:**
  - Base: `tsconfig.json`
  - Web: `apps/web/tsconfig.app.json`
  - API: `apps/api/tsconfig.json`
  - Mobile: `apps/mobile/tsconfig.json`

### Code Quality Rules

- ⚠️ **Variables non utilisées** → Warning (use `_variable` to ignore)
- ⚠️ **TypeScript `any`** → Warning
- ⚠️ **Non-null assertions `!`** → Warning
- ✅ **Console.log in API** → Allowed (server-side logging)
- ⚠️ **Console.log in Web/Mobile** → Warning (debug only)

### Pre-commit Hooks (Husky + lint-staged)

- **Auto-format** staged files with Prettier
- **Auto-fix** ESLint issues
- **Prevent commits** with errors
- **Only check changed files** for performance

## 📁 App-Specific Guidelines

### API (`apps/api/`)

- **Framework:** Bun + Hono
- **Database:** PostgreSQL with Bun.sql
- **Authentication:** JWT with jose library
- **Validation:** Zod schemas
- **Console logging:** Allowed for server debugging

### Web (`apps/web/`)

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite (transitioning to Bun)
- **UI:** Tailwind CSS + Radix UI
- **State:** Zustand
- **Routing:** React Router v7

### Mobile (`apps/mobile/`)

- **Framework:** React Native + Expo
- **Navigation:** React Navigation v7
- **Storage:** Expo SecureStore
- **Authentication:** Expo Local Authentication
- **Styling:** Tailwind CSS (React Native)

## 🔧 Development Conventions

### Variable Naming

- Use `_variable` for intentionally unused variables
- Use descriptive names, avoid abbreviations
- Use camelCase for variables, PascalCase for components

### Import Organization

- Imports are auto-sorted by ESLint
- Group: external packages → internal packages → relative imports
- Use type imports: `import type { Type } from './types'`

### Error Handling

- Use proper error boundaries in React apps
- Validate inputs with Zod in API
- Use TypeScript strict mode for compile-time safety
- Avoid non-null assertions (`!`), use explicit checks

### Git Workflow

- Pre-commit hooks ensure code quality
- All code is formatted and linted before commit
- Use conventional commit messages
- CI/CD runs quality checks on all PRs

## 📚 Documentation

- **API Documentation:** Auto-generated from Zod schemas
- **Component Documentation:** JSDoc comments for complex components
- **Architecture Decisions:** Document in ADRs (Architecture Decision Records)

For more information about Bun APIs, read the docs in `node_modules/bun-types/docs/**.md`.
