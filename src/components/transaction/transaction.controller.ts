import { Request, Response } from 'express';
import CustomResponse from '../../utils/custom-response';
import transactionServiceInstance, { TransactionService } from './transaction.service';
import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import { boundMethod } from 'autobind-decorator';

class TransactionController {
  private logger: ILogger;
  private transactionService: TransactionService;

  constructor(
  ) {
    this.logger = Logger;
    this.transactionService = transactionServiceInstance;
  }

  @boundMethod
  public async createTransaction(req: Request, res: Response){
    await this.transactionService.createTransaction({ ...req.body });
    return CustomResponse.sendWithoutData(res, 'Done', 201);
  }

  @boundMethod
  public async getTransactionsByAccountId(req: Request, res: Response){
    const userTransactions = await this.transactionService
      .getTransactionsByAccountId(req.body.account_id);
    return CustomResponse.send(res, userTransactions);
  }

  @boundMethod
  public async getMasterAccountBalance(req: Request, res: Response){
    const masterAccount = await this.transactionService.getMasterAccountBalance();
    return CustomResponse.send(res, masterAccount);
  }

  @boundMethod
  public async getDueTransactions(req: Request, res: Response){
    const dueTransactions = await this.transactionService
      .getDueTransactions();
    return CustomResponse.send(res, dueTransactions);
  }

  @boundMethod
  public async disburseDueTransactions(req: Request, res: Response){
    await this.transactionService.disburseDueTransactions();
    return CustomResponse.sendWithoutData(res);
  }
}

export default new TransactionController();