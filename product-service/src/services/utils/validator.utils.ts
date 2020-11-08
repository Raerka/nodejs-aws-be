import * as Joi from 'joi';
import { Product } from '../../models/Product';

const productSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(1).required(),
  count: Joi.number().min(1).required(),
});

export function validateProductSchema(product: Product) {
  const { error, value } = productSchema.validate(product);

  if (error) {
    throw new Error(error.message);
  }

  return value;
}
