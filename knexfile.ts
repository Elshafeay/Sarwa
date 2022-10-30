require('dotenv').config();

const shared = {
  migrations: {
    directory: './admin/mysql/migrations',
    extension: 'ts',
    tableName: 'migrations',
  },
};

module.exports = {

  develop: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    ...shared,
  },

  test: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_TEST_NAME,
    },
    ...shared,
  },

};
