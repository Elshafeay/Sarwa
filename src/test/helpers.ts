import supertest from 'supertest';
import app from '../../app';
import commonService from '../../src/utils/common/common.service';

const truncateDB = async () => {
  await commonService.dbTruncate();
};

const signup = async () => {
  const randomId = Math.floor(Math.random() * 1000);
  const response = await supertest(app)
    .post('/users')
    .send({
      firstname: 'test',
      lastname: 'test',
      email: `test-${randomId}@test.com`,
      password: '123456',
    });
  const token = response.body.data.token;
  return 'Bearer ' + token;
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export { truncateDB, signup, sleep };