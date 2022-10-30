import { Knex } from 'knex';
import { Currencies, TransactionStatuses } from '../../../src/components/transaction/transaction.enums';
import {
  Tables,
  Timestamps,
  Transaction
} from '../schemas.enums';


function addTimeStamps(knex: Knex, table: Knex.CreateTableBuilder) {
  table.timestamp(Timestamps.created_at).defaultTo(knex.fn.now());
  table.timestamp(Timestamps.updated_at).defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
}

function createTransactionTable(knex: Knex, table: Knex.CreateTableBuilder) {
  table.string(Transaction.transaction_id, 255).notNullable().primary();
  table.string(Transaction.account_id, 255).notNullable();
  table.string(Transaction.destination_account_id, 255).notNullable();
  table.enum(Transaction.status, Object.values(TransactionStatuses)).notNullable();
  table.integer(Transaction.amount).notNullable();
  table.enum(Transaction.currency, Object.values(Currencies)).notNullable();
  table.timestamp(Transaction.received_at).notNullable();
  
  addTimeStamps(knex, table);
}

export async function up(knex: Knex): Promise<void> {

  return knex.schema
    .createTable(Tables.Transaction, (table: Knex.CreateTableBuilder) => createTransactionTable(knex, table))
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable(Tables.Transaction)
}
