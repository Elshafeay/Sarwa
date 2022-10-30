import { Express } from 'express';
import transaction from './transaction/transaction.routes';

class routing {

  api(app: Express) {
    transaction(app);
  }
}
export default new routing();