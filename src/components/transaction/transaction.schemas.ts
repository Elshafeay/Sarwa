import Joi from 'joi';
import { IValidationSchema } from '../../utils/joi.interfaces';
import { Currencies } from './transaction.enums';

export const createTransactionValidation: IValidationSchema = {
  body: Joi.object({
    transaction_id: Joi
      .string()
      .required(),

    account_id: Joi
      .string()
      .required(),

    destination_account_id: Joi
      .string()
      .invalid(Joi.ref('account_id'))
      .messages({
        'any.invalid': '\"account_id\" and \"destination_account_id\" can\'t be the same',
      })
      .required(),

    amount: Joi
      .number()
      .min(1)
      .required(),

    currency: Joi
      .string()
      .valid(...Object.values(Currencies))
      .default(Currencies.USD)
      .required(),

    received_at: Joi
      .date()
      .max('now')
      .required(),
  }).required(),
};

export const listTransactionsValidation: IValidationSchema = {
  body: Joi.object({
    account_id: Joi
      .string()
      .required(),
  }).required(),
};
