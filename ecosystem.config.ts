    
module.exports = {
    apps: [
      {
        name: 'api',
        cwd: './apps/api', // path to backend
        script: 'bun',
        args: 'start', // or your backend start command
        env: {
          NODE_ENV: 'production',
        },
      },
      {
        name: 'web',
        cwd: './apps/web', // path to frontend
        script: 'bun',
        args: 'start', // or your frontend start command
        env: {
          NODE_ENV: 'production',
        },
      },
      {
        name: 'worker',
        cwd: './apps/worker', // path to worker
        script: 'bun',
        args: 'start', // or your worker start command
        env: {
          NODE_ENV: 'production',
        },
      },
      {
        name: 'pusher',
        cwd: './apps/pusher', // path to pusher
        script: 'bun',
        args: 'start', // or your pusher start command
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  