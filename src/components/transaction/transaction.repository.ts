import DBManager, { dbManagerInstance } from '../../../config/DBManager';
import {
  ICreateTransaction,
  IMasterAccountQuery,
  ITransactionLogModel,
  ITransactionModel,
} from './transaction.interfaces';
import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import { TransactionDefColumn, TransactionStatuses } from './transaction.enums';
import { boundMethod } from 'autobind-decorator';
import { Tables } from '../../../admin/mysql/schemas.enums';

export class TransactionRepository {
  private readonly tableName = 'transactions';
  private queryBuilder: DBManager;
  private flatColumns: TransactionDefColumn[];
  private logger: ILogger;

  constructor(
  ) {
    this.logger = Logger;
    this.queryBuilder = dbManagerInstance;
    this.flatColumns = Object.values(TransactionDefColumn);
  }

  @boundMethod
  public async findOneById(transaction_id: string): Promise<ITransactionModel|null>{
    const transaction = await this.queryBuilder.mysql<ITransactionModel>(this.tableName)
      .select(...this.flatColumns)
      .where({ transaction_id })
      .first();

    return transaction || null;
  }

  @boundMethod
  public async findByAccountId(account_id: string): Promise<ITransactionModel[]>{
    const transactions = await this.queryBuilder.mysql<ITransactionModel>(this.tableName)
      .select(this.flatColumns)
      .where({ account_id })
      .orWhere({ destination_account_id: account_id });

    return transactions;
  }

  @boundMethod
  public async findAll(): Promise<ITransactionModel[]>{
    const transactions = await this.queryBuilder.mysql<ITransactionModel>(this.tableName)
      .select(this.flatColumns);

    return transactions;
  }

  @boundMethod
  public async getMasterAccountBalance(): Promise<IMasterAccountQuery>{
    const [masterAccount] = await this.queryBuilder.mysql<ITransactionModel>(this.tableName)
      .sum('amount as balance')
      .where({ status: TransactionStatuses.Pending });

    return masterAccount;
  }

  @boundMethod
  public async create(transaction: ICreateTransaction): Promise<void>{
    await this.queryBuilder.mysql<ITransactionModel>(this.tableName)
      .insert(transaction);

    this.logger.info('New Transaction Has Been Created!');
  }

  @boundMethod
  public async getDueTransactions(dueTimeDate: string): Promise<ITransactionModel[]>{
    const transactions = await this.queryBuilder.mysql<ITransactionModel>(this.tableName)
      .select(this.flatColumns)
      .where({
        status: TransactionStatuses.Pending,
      })
      .andWhereRaw(`received_at < "${dueTimeDate}"`);

    return transactions;
  }

  @boundMethod
  public async disburseTransaction(transaction_id: string): Promise<void>{
    await this.queryBuilder.mysql<ITransactionModel>(this.tableName)
      .update({ status: TransactionStatuses.Disbursed })
      .where({ transaction_id });
  }

  @boundMethod
  public async createTransactionLog(
    transaction_id: string,
    status: TransactionStatuses,
  ): Promise<void>{
    await this.queryBuilder.mysql<ITransactionLogModel>(Tables.TransactionLog)
      .insert({ transaction_id, status });

    this.logger.info(`Transaction with id: ${transaction_id} has a new status: ${status}`);
  }
}

export default new TransactionRepository();