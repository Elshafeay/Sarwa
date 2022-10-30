import app from '../../../app';
import supertest from 'supertest';
import { sleep, truncateDB } from '../../test/helpers';
import { transactions } from './transaction.seedings';
import transactionServiceInstance from './transaction.service';
import moment from 'moment';
import { dbManagerInstance } from '../../../config/DBManager';
import { TransactionStatuses } from './transaction.enums';
import mockAxios from 'jest-mock-axios';

describe('[E2E] Transactions', function() {

  describe('Testing the create endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('creates a transaction', async function() {
      // status code should be 201 `Created`
      await supertest(app)
        .post('/transactions')
        .send(transactions[0])
        .expect(201);

    });

    // Failure scenarios
    it('returns 400 if a transaction existed with the same id', async function() {
      // status code should be 201 `Created`
      const createTransaction1Response = await supertest(app)
        .post('/transactions')
        .send(transactions[0]);
      expect(createTransaction1Response.statusCode).toBe(201);

      // status code should be 400
      const createTransaction2Response = await supertest(app)
        .post('/transactions')
        .send(transactions[0]);
      expect(createTransaction2Response.statusCode).toBe(400);
    });

    // Failure scenarios
    it('returns 400 if a transaction violates any validation rule', async function() {

      // received_at is in the future
      await supertest(app)
        .post('/transactions')
        .send({
          ...transactions[0],
          received_at: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        })
        .expect(400);

      // account_id and destination_account_id are the same
      await supertest(app)
        .post('/transactions')
        .send({
          ...transactions[0],
          account_id: '11111',
          destination_account_id: '11111',
        })
        .expect(400);

      // amount is less than 1
      await supertest(app)
        .post('/transactions')
        .send({
          ...transactions[0],
          amount: 0,
        })
        .expect(400);

      // Currency is unknown / not USD
      await supertest(app)
        .post('/transactions')
        .send({
          ...transactions[0],
          currency : 'EGP',
        })
        .expect(400);
    });
  });

  describe('Testing the search endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('searches through transactions with account_id', async function() {
      await dbManagerInstance.mysql('transactions')
        .insert([
          {
            ...transactions[0],
            status: TransactionStatuses.Pending,
          },
          {
            ...transactions[1],
            status: TransactionStatuses.Pending,
          },
          {
            ...transactions[2],
            status: TransactionStatuses.Pending,
          },
          {
            ...transactions[3],
            status: TransactionStatuses.Pending,
          },
        ]);

      const response = await supertest(app)
        .post('/transactions/search')
        .send({ account_id: '12345' });

      expect(response.statusCode).toEqual(200);
      expect(response.body.data.length).toEqual(3);
    });

    // Failure scenarios
    it('returns an empty list if there\'s no transactions for this account_id', async function() {
      const response = await supertest(app)
        .post('/transactions/search')
        .send({ account_id: '12345' });

      expect(response.statusCode).toEqual(200);
      expect(response.body.data.length).toEqual(0);
    });

  });

  describe('Testing the master-account endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('calculates the master account balance', async function() {
      await dbManagerInstance.mysql('transactions')
        .insert([
          {
            ...transactions[0],
            status: TransactionStatuses.Pending,
          },
          {
            ...transactions[1],
            status: TransactionStatuses.Pending,
          },
          {
            ...transactions[2],
            status: TransactionStatuses.Pending,
          },
        ]);

      const response = await supertest(app)
        .get('/master-account');

      expect(response.statusCode).toEqual(200);
      expect(response.body.data.balance).toEqual(
        transactions[0].amount + transactions[1].amount + transactions[2].amount,
      );
    });

  });

  describe('Testing the due transactions endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('fetches the due transactions', async function() {
      await dbManagerInstance.mysql('transactions')
        .insert([
          {
            ...transactions[0],
            received_at: moment.utc(moment().subtract(1, 'days')
              .format('YYYY-MM-DD 15:00:00')).local().format('YYYY-MM-DD HH:mm:ss'),
            status: TransactionStatuses.Pending,
          },
          {
            ...transactions[1],
            received_at: moment.utc(moment().subtract(1, 'days')
              .format('YYYY-MM-DD 17:00:00')).local().format('YYYY-MM-DD HH:mm:ss'),
            status: TransactionStatuses.Pending,
          },
          {
            ...transactions[2],
            received_at: moment.utc(moment().subtract(1, 'days')
              .format('YYYY-MM-DD 20:00:00')).local().format('YYYY-MM-DD HH:mm:ss'),
            status: TransactionStatuses.Pending,
          },
          {
            ...transactions[3],
            received_at: moment.utc(moment().subtract(2, 'days')
              .format('YYYY-MM-DD 00:00:00')).local().format('YYYY-MM-DD HH:mm:ss'),
            status: TransactionStatuses.Pending,
          },
        ]);

      const response = await supertest(app)
        .get('/transactions/due');

      expect(response.statusCode).toEqual(200);
      expect(response.body.data.length).toEqual(2);
    });

  });

  describe('Testing disburse due transactions functionality', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('disburses the due transactions', async function() {
      await dbManagerInstance.mysql('transactions')
        .insert([
          {
            ...transactions[0],
            received_at: moment.utc(moment().subtract(1, 'days')
              .format('YYYY-MM-DD 15:00:00')).local().format('YYYY-MM-DD HH:mm:ss'),
            status: TransactionStatuses.Pending,
          },
          {
            ...transactions[1],
            received_at: moment.utc(moment().subtract(1, 'days')
              .format('YYYY-MM-DD 17:00:00')).local().format('YYYY-MM-DD HH:mm:ss'),
            status: TransactionStatuses.Pending,
          },
        ]);

      await transactionServiceInstance.disburseDueTransactions();
      mockAxios.mockResponse({ data: { status:200 } });

      // wait for the callback to function to get excuted, since we just mocked axios reponse
      await sleep(10);

      const [transaction1] = await dbManagerInstance.mysql('transactions')
        .select()
        .whereIn(
          'transaction_id',
          [ transactions[0].transaction_id ],
        );

      const [transaction2] = await dbManagerInstance.mysql('transactions')
        .select()
        .whereIn(
          'transaction_id',
          [ transactions[1].transaction_id ],
        );

      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith(
        process.env.BROKERAGE_URL!,
        {
          source_account_id: transaction1.account_id,
          destination_account_id: transaction1.destination_account_id,
          amount: transaction1.amount,
          currency: transaction1.currency,
        },
      );

      expect(transaction1.status).toEqual(TransactionStatuses.Disbursed);
      expect(transaction2.status).toEqual(TransactionStatuses.Pending);
    });

  });

});
