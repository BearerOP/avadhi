// ecosystem.config.js

module.exports = {
    apps: [
      {
        name: 'api',
        cwd: '/home/ubuntu/avadhi/apps/api', // absolute path recommended for PM2
        script: 'bun',
        args: 'start', // or your backend start command
        env: {
          NODE_ENV: 'production',
        },
      },
      {
        name: 'web',
        cwd: '/home/ubuntu/avadhi/apps/web', // absolute path recommended for PM2
        script: 'bun',
        args: 'start', // or your frontend start command
        env: {
          NODE_ENV: 'production',
        },
      },
      {
        name: 'worker',
        cwd: '/home/ubuntu/avadhi/apps/worker', // absolute path recommended for PM2
        script: 'bun',
        args: 'start', // or your worker start command
        env: {
          NODE_ENV: 'production',
        },
      },
      {
        name: 'pusher',
        cwd: '/home/ubuntu/avadhi/apps/pusher', // absolute path recommended for PM2
        script: 'bun',
        args: 'start', // or your pusher start command
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  