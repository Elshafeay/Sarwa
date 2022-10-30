import { Express } from 'express';
import { validateRequest } from '../../middlewares/validate-request';

import transactionController from './transaction.controller';
import { createTransactionValidation, listTransactionsValidation } from './transaction.schemas';

const transactionRouter = (app: Express) => {

  // create a transaction
  app.post(
    '/transactions',
    validateRequest(createTransactionValidation),
    transactionController.createTransaction,
  );

  // get/filter transactions by account_id
  app.post(
    '/transactions/search',
    validateRequest(listTransactionsValidation),
    transactionController.getTransactionsByAccountId,
  );

  // get due transactions
  app.get(
    '/transactions/due',
    transactionController.getDueTransactions,
  );

  // manually disburse due transactions
  app.post(
    '/transactions/disburse',
    transactionController.disburseDueTransactions,
  );

  // get master account details (balance)
  app.get(
    '/master-account',
    transactionController.getMasterAccountBalance,
  );

  // mock endpoint to simulate the brokerage bank
  app.post('/bank/disburse', (req, res) => res.end());
};

export default transactionRouter;