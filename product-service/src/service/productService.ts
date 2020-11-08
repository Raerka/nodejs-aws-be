import { Product } from '../models/Product';

const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

export const getAllProducts = (): Promise<string> =>
  readFile(`${__dirname}/data/productList.json`).then(data => data.toString());

export const getProductById = async (id: string): Promise<Product> => {
  const products = await getAllProducts();
  const result = JSON.parse(products).find(product => product.id === id);

  if (!result) {
    throw new Error();
  }

  return result;
};
