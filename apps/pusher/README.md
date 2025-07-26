# pusher

To install dependencies:

```bash
bun install
```

To run:

```bash
# Option 1: Run with environment variable
REDIS_URL=redis://localhost:6379 bun index.ts

# Option 2: Use the provided script
./run.sh
```

**Note**: This application requires Redis to be running and the `REDIS_URL` environment variable to be set. Make sure Redis is running on your system before starting the application.

This project was created using `bun init` in bun v1.2.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
