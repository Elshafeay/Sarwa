import DBManager, { dbManagerInstance } from '../../../config/DBManager';
import { Tables } from '../../../admin/mysql/schemas.enums';

export class CommonRepository {
  queryBuilder: DBManager;

  constructor(){
    this.queryBuilder = dbManagerInstance;
  }

  public async dbTruncate(){
    const tablesNames = Object.values(Tables);
    for(let tableName of tablesNames){
      await this.queryBuilder.mysql(tableName).del();
    };
  }
}

export default new CommonRepository();