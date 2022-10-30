import Logger from '../../middlewares/logger';
import { Logger as ILogger } from 'winston';
import commonRepositoryInstance, { CommonRepository } from './common.repository';
import moment from 'moment';

export class CommonService {
  private commonRepository: CommonRepository;
  private logger: ILogger;

  constructor(
  ) {
    this.logger = Logger;
    this.commonRepository = commonRepositoryInstance;
  }

  async dbTruncate(){
    await this.commonRepository.dbTruncate();
  }

  formatDate(date: string){
    return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
  }
}

export default new CommonService();