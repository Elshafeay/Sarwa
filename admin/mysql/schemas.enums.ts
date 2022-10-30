export enum Tables {
  Transaction = 'transactions',
  TransactionLog = 'transaction_logs',
}

export enum Timestamps {
  created_at = 'created_at',
  updated_at = 'updated_at',
}

export enum Transaction {
  transaction_id = 'transaction_id',
  account_id = 'account_id',
  destination_account_id = 'destination_account_id',
  status = 'status',
  amount = 'amount',
  currency = 'currency',
  received_at = 'received_at',
}

export enum TransactionLog {
  transaction_id = 'transaction_id',
  status = 'status',
}