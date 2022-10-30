import { Currencies, TransactionStatuses } from './transaction.enums';

export interface ITimestamps {
  createdAt: Date,
  updatedAt: Date
}

export interface ITransactionModel extends ITimestamps {
  transaction_id: string,
  account_id: string,
  destination_account_id: string,
  amount: Currencies
  status: TransactionStatuses
  currency: string
  received_at: string
}

export interface ICreateTransaction{
  transaction_id: string,
  account_id: string,
  destination_account_id: string,
  amount: Currencies,
  status: TransactionStatuses,
  currency: string
  received_at: string
}

export interface ITransactionLogModel extends ITimestamps {
  transaction_id: string,
  status: TransactionStatuses
}

export interface IMasterAccountQuery {
  balance: string
}