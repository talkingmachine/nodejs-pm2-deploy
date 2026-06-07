require('dotenv').config({ path: '.env.deploy' });

const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH } = process.env;

module.exports = {
  apps: [
    {
      name: 'api-service',
      script: './dist/app.js',
      env_production: {
        NODE_ENV: 'production',
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
      // Запускается ЛОКАЛЬНО до деплоя: копирует .env с секретами на сервер
      'pre-deploy-local': `bash ./scripts/deployEnv.sh ${DEPLOY_HOST} ${DEPLOY_PATH}`,
      // Запускается НА СЕРВЕРЕ после git pull: ставит зависимости, собирает TS, перезапускает
      'post-deploy':
        'cd backend && npm install && npm run build && pm2 startOrReload ecosystem.config.js --env production',
    },
  },
};
