export enum TransactionDefColumn {
  transaction_id = 'transaction_id',
  account_id = 'account_id',
  destination_account_id = 'destination_account_id',
  status = 'status',
  amount = 'amount',
  currency = 'currency',
  received_at = 'received_at'
}

export enum Currencies {
  USD = 'USD'
}

export enum TransactionStatuses {
  Pending = 'Pending',
  Disbursed = 'Disbursed',
  Failed = 'Failed',
}