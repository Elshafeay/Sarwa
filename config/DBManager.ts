import { Knex, knex } from 'knex';
import Logger from '../src/middlewares/logger';

export default class DBManager{
  private dbConfig: any;
  private knexInstance: Knex;

  constructor(){
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

    if (process.env.NODE_ENV == 'test'){
      config.database = process.env.DB_TEST_NAME;
    }

    const dbConfig = {
      client: 'mysql2',
      connection: {
        ...config,
      },
      pool: {
        min: 0,
        max: 7,
      },
      migrations: {
        tableName: 'migrations',
      },
    };

    this.dbConfig = dbConfig;
    this.knexInstance = knex(this.dbConfig);
  }

  async testConnection(){
    return await this.knexInstance.raw('SELECT 1;').then(() => {
      // Success / boot rest of app
      Logger.info('Connection to database has been established successfully.');
    }).catch(err => {
      Logger.error('Unable to connect to the database:', err);
      throw err;
    });
  }

  mysql<T extends {}>(table: string): Knex.QueryBuilder<T> {
    const queryBuilder = this
      .knexInstance(table);

    return queryBuilder;
  }

  raw(query: string) {
    const queryBuilder = this
      .knexInstance.raw(query);

    return queryBuilder;
  }
}

export const dbManagerInstance = new DBManager();