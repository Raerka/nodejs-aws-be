import { Product } from '../models/Product';
import { executeQuery, executeTransactionQuery } from './db/pg-client';
import { validateProductSchema } from './utils/validator.utils';

export const getAllProducts = async (): Promise<Array<Product>> => {
  const query = `select * from products inner join stocks on id = product_id where count > 0`;

  return executeQuery<Product>(query);
};

export const getProductById = async (id: string): Promise<Product> => {
    const query = `select * from products inner join stocks on id = product_id where id = '${id}'`;

    const [product] = await executeQuery<Product>(query);

    if (!product) {
      throw new Error();
    }

    return product;
  };

export async function createProductInDB(product: Product): Promise<Product> {
  validateProductSchema(product);

  const { title, description, price, count } = product;

  const productQuery =
    `insert into products (title, description, price) values ('${title}', '${description}', '${price.toString()}') returning *`;

  const createStock = prevValues =>
    `insert into stocks (product_id, count) values ('${prevValues[0][0].id}', '${count.toString()}') returning count`;

  const result = await executeTransactionQuery([productQuery, createStock]);

  return result.flat().reduce((acc, item) => ({ ...acc, ...item}), { });
}
