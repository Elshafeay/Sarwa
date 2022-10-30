import { Knex } from 'knex';
import { TransactionStatuses } from '../../../src/components/transaction/transaction.enums';
import {
  Tables,
  Timestamps,
  Transaction,
  TransactionLog
} from '../schemas.enums';


function addTimeStamps(knex: Knex, table: Knex.CreateTableBuilder) {
  table.timestamp(Timestamps.created_at).defaultTo(knex.fn.now());
  table.timestamp(Timestamps.updated_at).defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
}

function createTransactionLogTable(knex: Knex, table: Knex.CreateTableBuilder) {
  table.string(TransactionLog.transaction_id, 255).notNullable();
  table.enum(TransactionLog.status, Object.values(TransactionStatuses)).notNullable();
  
  table
    .foreign(TransactionLog.transaction_id)
    .references(Transaction.transaction_id)
    .inTable(Tables.Transaction)
    .onDelete('CASCADE')

  addTimeStamps(knex, table);
}

export async function up(knex: Knex): Promise<void> {

  return knex.schema
    .createTable(Tables.TransactionLog, (table: Knex.CreateTableBuilder) => createTransactionLogTable(knex, table))
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable(Tables.TransactionLog)
}
