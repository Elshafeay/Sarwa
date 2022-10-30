import { BadRequestError } from '../../errors/bad-request-error';
import { ICreateTransaction } from './transaction.interfaces';
import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import transactionRepositoryInstance, { TransactionRepository } from './transaction.repository';
import { boundMethod } from 'autobind-decorator';
import { TransactionStatuses } from './transaction.enums';

import moment from 'moment';
import commonService from '../../utils/common/common.service';
import axios from 'axios';

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private logger: ILogger;

  constructor(
  ) {
    this.logger = Logger;
    this.transactionRepository = transactionRepositoryInstance;
  }

  @boundMethod
  public async createTransaction(dataObject: ICreateTransaction){
    const existingTransaction = await this.transactionRepository
      .findOneById(dataObject.transaction_id);
    if(existingTransaction){
      throw new BadRequestError('There\'s a transaction with this id already!');
    }

    const received_at = moment.utc(dataObject.received_at).local().format('YYYY-MM-DD HH:mm:ss');

    await this.transactionRepository.create({
      ...dataObject,
      received_at,
      status: TransactionStatuses.Pending,
    });

    const transaction = await this.transactionRepository.findOneById(dataObject.transaction_id);
    if (transaction){
      transaction.received_at = commonService.formatDate(transaction?.received_at);
    }

    return transaction;
  }

  @boundMethod
  public async getTransactionsByAccountId(account_id: string){
    const transactions = await this.transactionRepository.findByAccountId(account_id);
    transactions.forEach(
      transaction => transaction.received_at = commonService.formatDate(transaction?.received_at),
    );
    return transactions;
  }

  @boundMethod
  public async getMasterAccountBalance(){
    const masterAccount = await this.transactionRepository
      .getMasterAccountBalance();
    return { ...masterAccount, balance: +masterAccount.balance };
  }

  @boundMethod
  public async getDueTransactions(){
    const dueDateTime = moment
      .utc(moment().subtract(1, 'days').format('YYYY-MM-DD 16:00:00'))
      .local().format('YYYY-MM-DD HH:mm:ss');

    const dueTransaction = await this.transactionRepository
      .getDueTransactions(dueDateTime);

    return dueTransaction;
  }

  @boundMethod
  public async disburseDueTransactions(){
    // so we can easily change the cut-off time
    const dueDateTime = moment
      .utc(moment().subtract(1, 'days').format('YYYY-MM-DD 16:00:00'))
      .local().format('YYYY-MM-DD HH:mm:ss');

    const dueTransactions = await this.transactionRepository
      .getDueTransactions(dueDateTime);

    if(!dueTransactions.length){
      this.logger.info('There are no due transactions to disburse!');
    }

    for(let transaction of dueTransactions){
      await this.disburseTransaction(transaction.transaction_id);
    }
  }

  @boundMethod
  public async disburseTransaction(transaction_id: string){
    const transaction = await this.transactionRepository.findOneById(transaction_id);

    const data = {
      source_account_id: transaction?.account_id,
      destination_account_id: transaction?.destination_account_id,
      amount: transaction?.amount,
      currency: transaction?.currency,
    };

    axios.post(process.env.BROKERAGE_URL!, data).then(async() => {
      await this.transactionRepository.disburseTransaction(transaction_id);
      await this.transactionRepository.createTransactionLog(
        transaction_id,
        TransactionStatuses.Disbursed,
      );
      this.logger.info(`Disbursed Transaction with id: ${transaction_id}`);
    }).catch(async() => {
      await this.transactionRepository.createTransactionLog(
        transaction_id,
        TransactionStatuses.Failed,
      );
      this.logger.info(`Failed to disburse Transaction with id: ${transaction_id}`);
    });
  }
}

export default new TransactionService();