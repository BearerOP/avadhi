#!/bin/bash

# Set Redis URL environment variable
export REDIS_URL=redis://localhost:6379

# Run the pusher application
bun index.ts 