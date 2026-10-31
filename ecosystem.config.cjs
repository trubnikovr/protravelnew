const path = require('node:path');

const root = __dirname;

module.exports = {
  apps: [
    {
      name: 'protravel-backend-dev',
      cwd: path.join(root, 'apps/backend-api'),
      script: path.join(root, 'apps/backend-api/node_modules/.bin/nest'),
      args: 'start --watch',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      env: { NODE_ENV: 'development' },
    },
    {
      name: 'protravel-dashboard-dev',
      cwd: path.join(root, 'apps/frontend-dashboard'),
      script: path.join(root, 'apps/frontend-dashboard/node_modules/.bin/vite'),
      args: '--host 0.0.0.0 --port 3001',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      env: { NODE_ENV: 'development' },
    },
    {
      name: 'protravel-mobile-metro-dev',
      cwd: path.join(root, 'apps/mobile'),
      script: path.join(root, 'node_modules/.bin/react-native'),
      args: 'start --host 0.0.0.0 --port 8081',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      env: { NODE_ENV: 'development', REACT_NATIVE_PACKAGER_HOSTNAME: '0.0.0.0' },
    },
  ],
};
