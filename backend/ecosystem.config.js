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
      'pre-deploy-local': `bash ./scripts/deployEnv.sh ${DEPLOY_HOST} ${DEPLOY_PATH}`,
      'post-deploy':
        'export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && cd backend && npm install && npm run build && pm2 startOrReload ecosystem.config.js --env production',
    },
  },
};
