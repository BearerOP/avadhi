# Worker - Website Monitoring Service

This worker service monitors websites by checking their availability and response times from different regions.

## 🚀 Quick Start

### Prerequisites
- Redis server running
- Database with regions seeded
- Environment variables configured

### 1. Install Dependencies
```bash
bun install
```

### 2. Set up Environment Variables
Create a `.env` file in the worker directory:

```env
# Worker Configuration
WORKER_ID="worker-1"
REGION_ID="us-east-1"

# Database (if not using global env)
DATABASE_URL="postgresql://username:password@localhost:5432/avadhi?schema=public"

# Redis (if not using global env)
REDIS_URL="redis://localhost:6379"
```

### 3. Run the Worker
```bash
# Option 1: Run with environment variables
WORKER_ID=worker-1 REGION_ID=us-east-1 bun index.ts

# Option 2: Use .env file
bun index.ts
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `WORKER_ID` | Unique identifier for this worker instance | `worker-1` |
| `REGION_ID` | Region where this worker operates | `us-east-1` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |

### Available Regions
The following regions are pre-seeded in the database:
- `us-east-1` - US East (N. Virginia)
- `us-west-1` - US West (N. California)
- `eu-west-1` - Europe (Ireland)
- `ap-southeast-1` - Asia Pacific (Singapore)

## 🏗️ Architecture

### How it Works
1. **Redis Stream**: Reads website monitoring tasks from Redis stream
2. **HTTP Checks**: Performs HTTP requests to check website availability
3. **Database Storage**: Stores monitoring results in PostgreSQL
4. **Region Support**: Each worker operates from a specific region

### Data Flow
```
Redis Stream → Worker → HTTP Request → Database
     ↓           ↓         ↓           ↓
  Website    Region    Response    WebsiteTick
   Tasks     Worker     Time       Records
```

## 🐛 Troubleshooting

### Common Issues

1. **Foreign Key Constraint Error**
   ```
   Foreign key constraint violated on the constraint: `WebsiteTick_region_id_fkey`
   ```
   **Solution**: Run the database seed to create regions:
   ```bash
   bun run db:seed
   ```

2. **Redis Connection Error**
   ```
   Redis Client Error
   ```
   **Solution**: Ensure Redis is running:
   ```bash
   # Start Redis (macOS)
   brew services start redis
   
   # Or using Docker
   docker run -d -p 6379:6379 redis:alpine
   ```

3. **Database Connection Error**
   ```
   Error: connect ECONNREFUSED
   ```
   **Solution**: Check your DATABASE_URL and ensure PostgreSQL is running

### Running Multiple Workers

You can run multiple workers for different regions:

```bash
# Terminal 1
WORKER_ID=worker-1 REGION_ID=us-east-1 bun index.ts

# Terminal 2  
WORKER_ID=worker-2 REGION_ID=us-west-1 bun index.ts

# Terminal 3
WORKER_ID=worker-3 REGION_ID=eu-west-1 bun index.ts
```

## 📊 Monitoring

The worker logs the following information:
- Number of websites processed per cycle
- Region and worker ID for identification
- Any errors during website checks

## 🔄 Integration

This worker integrates with:
- **Pusher**: Adds websites to Redis stream
- **API**: Provides monitoring data via REST endpoints
- **Web App**: Displays monitoring results

---

This project was created using `bun init` in bun v1.2.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
