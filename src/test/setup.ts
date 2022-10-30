import { truncateDB } from './helpers';

beforeAll(async () => {
  process.env.JWT_KEY = 'secret';
  process.env.NODE_ENV = 'test';
  process.env.BROKERAGE_URL = 'http://localhost';
  await truncateDB();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await truncateDB();
});
