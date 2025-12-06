module.exports = {
  apps: [{
    name: 'escore-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/escore-frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_BASE_URL: 'http://51.20.123.246'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
