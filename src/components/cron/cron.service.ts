import { boundMethod } from 'autobind-decorator';
import cron from 'cron';
import transactionServiceInstance, { TransactionService } from '../transaction/transaction.service';

export class CronService {
  private transactionService: TransactionService;

  constructor(
  ) {
    this.transactionService = transactionServiceInstance;
  }

  @boundMethod
  public startCronjobs() {
    new cron.CronJob({
      // every day at 9:00 AM
      cronTime: '51 2 * * *',
      onTick: () => {
        this.transactionService.disburseDueTransactions();
      },
      start: true,
      timeZone: 'UTC',
    });
  };
}

export default new CronService();