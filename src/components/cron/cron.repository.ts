import cron from 'cron';
import { Logger as ILogger } from 'winston';
import Logger from '../../middlewares/logger';

export class CronRepository {
  private logger: ILogger;

  constructor(
  ) {
    this.logger = Logger;
  }

  public static startCronjobs() {

  };
}

export default new CronRepository();