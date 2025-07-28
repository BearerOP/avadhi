# Avadhi - Website Monitoring Platform

A modern website monitoring platform built with Next.js, Express.js, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database
- Environment variables configured

### 1. Install Dependencies
```bash
bun install
```

### 2. Set up Database
```bash
# Generate Prisma client
bun run db:generate

# Run migrations (make sure your database is running)
bun run db:migrate

# Seed the database with initial data (regions)
bun run db:seed
```

### 3. Start All Applications
```bash
bun run dev
```

This will start:
- **API Server**: http://localhost:3000
- **Web App**: http://localhost:3001  
- **Documentation**: http://localhost:3002

### 4. Start Monitoring Services (Optional)
```bash
# Start Redis (if not running)
brew services start redis

# Start worker for monitoring
cd apps/worker
WORKER_ID=worker-1 REGION_ID=us-east-1 bun index.ts
```

---

## 📁 Project Structure

```
avadhi/
├── apps/
│   ├── api/          # Express.js API server
│   ├── web/          # Next.js web application
│   ├── docs/         # Next.js documentation site
│   ├── worker/       # Website monitoring worker
│   └── pusher/       # Redis stream pusher
├── packages/
│   ├── store/        # Prisma database client
│   ├── redis-be/     # Redis backend utilities
│   ├── ui/           # Shared UI components
│   ├── eslint-config/    # ESLint configuration
│   ├── tailwind-config/  # Tailwind CSS configuration
│   └── typescript-config/ # TypeScript configuration
└── package.json      # Root package.json with Turborepo
```

---

## 🛠️ Available Scripts

### Root Commands
```bash
# Development
bun run dev          # Start all applications
bun run dev:api      # Start only API server
bun run dev:web      # Start only web app
bun run dev:docs     # Start only documentation

# Build & Production
bun run build        # Build all applications
bun run start        # Start all applications in production mode

# Code Quality
bun run lint         # Lint all packages
bun run check-types  # Type check all packages
bun run format       # Format code with Prettier

# Database
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run database migrations
bun run db:seed      # Seed database with initial data
bun run db:studio    # Open Prisma Studio

# Maintenance
bun run clean        # Clean all build artifacts
bun run install:all  # Install all dependencies
```

### Individual App Commands
```bash
# API Server
cd apps/api
bun run dev          # Start with hot reload
bun run build        # Build for production
bun run start        # Start production server

# Web App
cd apps/web
bun run dev          # Start on port 3001
bun run build        # Build for production
bun run start        # Start production server

# Documentation
cd apps/docs
bun run dev          # Start on port 3002
bun run build        # Build for production
bun run start        # Start production server
```

---

## 🌐 Application URLs

| Application | URL | Description |
|-------------|-----|-------------|
| **API Server** | http://localhost:3000 | Express.js REST API |
| **Web App** | http://localhost:3001 | Main web application |
| **Documentation** | http://localhost:3002 | API documentation |

---

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/avadhi?schema=public"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Server Port (optional, defaults to 3000)
PORT=3000
```

### Database Setup

1. **Install PostgreSQL** (if not already installed)
2. **Create database**:
   ```sql
   CREATE DATABASE avadhi;
   ```
3. **Run migrations**:
   ```bash
   bun run db:migrate
   ```

---

## 📊 API Endpoints

### Authentication
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - Login user
- `GET /api/v1/user/me` - Get current user

### Websites
- `GET /api/v1/website` - Get user's websites
- `POST /api/v1/website` - Create new website
- `PATCH /api/v1/website/:id` - Update website
- `DELETE /api/v1/website/:id` - Delete website
- `GET /api/v1/website/:id/logs` - Get website logs (5-min intervals)

---

## 🏗️ Development

### Adding New Features

1. **API Routes**: Add to `apps/api/routes/v1/`
2. **Database Models**: Update `packages/store/prisma/schema.prisma`
3. **UI Components**: Add to `packages/ui/src/`
4. **Web Pages**: Add to `apps/web/app/`

### Database Changes

```bash
# After modifying schema.prisma
bun run db:migrate

# To reset database (⚠️ destructive)
cd packages/store
npx prisma migrate reset
```

### Adding Dependencies

```bash
# Add to specific app/package
cd apps/api
bun add express

# Add to root (for dev dependencies)
bun add -D prettier
```

---

## 🚀 Deployment

### Production Build
```bash
# Build all applications
bun run build

# Start production servers
bun run start
```

### Docker (Optional)
```bash
# Build Docker image
docker build -t avadhi .

# Run with Docker Compose
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports 3000, 3001, 3002 are available
2. **Database connection**: Verify DATABASE_URL and PostgreSQL is running
3. **Build errors**: Run `bun run clean` then `bun run build`
4. **Type errors**: Run `bun run check-types` to identify issues
5. **Worker foreign key errors**: Run `bun run db:seed` to create regions

### Reset Everything
```bash
# Clean all build artifacts
bun run clean

# Reinstall dependencies
bun run install:all

# Regenerate Prisma client
bun run db:generate
```

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details.
