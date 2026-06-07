require('dotenv').config({ path: '.env.deploy' });

const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH } = process.env;

module.exports = {
  apps: [
    {
      name: 'api-service',
      // Запускаем через npm start (ts-node src/app.ts) — без сборки tsc, она кладёт слабый сервер.
      script: 'npm',
      args: 'start',
      env_production: {
        NODE_ENV: 'production',
        // ts-node не проверяет типы при старте — заметно меньше CPU/памяти на сервере.
        TS_NODE_TRANSPILE_ONLY: 'true',
      },
    },
  ],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: 'origin/master',
      repo: 'https://github.com/talkingmachine/nodejs-pm2-deploy.git',
      path: DEPLOY_PATH,
      'pre-deploy-local': `bash ./scripts/deployEnv.sh ${DEPLOY_HOST} ${DEPLOY_PATH}`,
      'post-deploy':
        'export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && cd backend && npm install && pm2 startOrReload ecosystem.config.js --env production',
    },
  },
};
