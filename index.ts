import app from './app';
import { checkingEnvVariables } from './config/checking-env-variables';
import { dbManagerInstance } from './config/DBManager';
import cronServiceInstance from './src/components/cron/cron.service';
import Logger from './src/middlewares/logger';

const start = async() => {
  const port = process.env.PORT || 3000;
  checkingEnvVariables();

  if(process.env.NODE_APP_INSTANCE){
    // We're in pm2 clusters mode

    // to work only once with pm2 clusters mode
    if(process.env.NODE_APP_INSTANCE == '0'){
      /*
          To avoid running the cron multiple times if we have multiple pm2 applications running
          on the same server.

          This means it will run only on the first instance
      */
      cronServiceInstance.startCronjobs();
    }
  }else{
    // to work with normal mode
    cronServiceInstance.startCronjobs();
  }

  await dbManagerInstance.testConnection();

  app.listen(port, () => Logger.info(`Listening on port ${port}!`));
};

start();