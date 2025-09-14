# Safetious Project Makefile
# TypeScript monorepo with Bun runtime

.PHONY: help install build dev quality check-quality lint format type-check clean clean-all test

# Default target
help:
	@echo "Safetious Project Commands:"
	@echo ""
	@echo "Development:"
	@echo "  install      Install all dependencies"
	@echo "  dev          Start all apps in development mode"
	@echo "  build        Build all apps for production"
	@echo ""
	@echo "Code Quality:"
	@echo "  quality      Run full quality check (format + lint + type-check)"
	@echo "  check-quality Check code quality without fixing"
	@echo "  lint         Auto-fix linting issues"
	@echo "  format       Format all files with Prettier"
	@echo "  type-check   Run TypeScript type checking"
	@echo ""
	@echo "Testing:"
	@echo "  test         Run all tests"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean        Remove build artifacts (dist/, .expo/)"
	@echo "  clean-all    Remove all node_modules and build artifacts"
	@echo ""
	@echo "Database:"
	@echo "  db-setup     Setup database"
	@echo "  db-migrate   Run database migrations"

# Development commands
install:
	@echo "📦 Installing dependencies with Bun..."
	bun install

dev:
	@echo "🚀 Starting development servers..."
	bun run dev

build:
	@echo "🏗️ Building all applications..."
	bun run build

# Code quality commands
quality:
	@echo "✨ Running full quality check and fixes..."
	bun run quality

check-quality:
	@echo "🔍 Checking code quality (no fixes)..."
	bun run format:check
	bun run lint --max-warnings 0
	bun run type-check

lint:
	@echo "🧹 Running linter with auto-fix..."
	bun run lint:fix

format:
	@echo "💅 Formatting code with Prettier..."
	bun run format

type-check:
	@echo "🔎 Running TypeScript type checking..."
	bun run type-check

# Testing
test:
	@echo "🧪 Running all tests..."
	bun test

# Database commands
db-setup:
	@echo "🗄️ Setting up database..."
	bun run db:setup

db-migrate:
	@echo "🗄️ Running database migrations..."
	bun run db:migrate

# Cleanup commands
clean:
	@echo "🧹 Cleaning build artifacts..."
	@find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name ".expo" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
	@echo "✅ Build artifacts cleaned"

clean-all: clean
	@echo "🧹 Cleaning all node_modules..."
	@find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
	@echo "🧹 Cleaning package manager caches..."
	@rm -rf ~/.bun/install/cache 2>/dev/null || true
	@echo "✅ All dependencies and caches cleaned"
	@echo "💡 Run 'make install' to reinstall dependencies"

# CLI tool commands
cli-build:
	@echo "🦀 Building Rust CLI tool..."
	bun run cli:build

cli-install:
	@echo "🦀 Installing Rust CLI tool..."
	bun run cli:install