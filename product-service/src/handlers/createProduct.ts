import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createProductInDB } from '../services/productService';
import { Product } from '../models/Product';
import { logLambdaRequest } from '../services/utils/logger.utils';

export const createProduct: APIGatewayProxyHandler = async event => {
  logLambdaRequest(event);

  try {
    const product: Product = JSON.parse(event.body);
    const createdProduct = await createProductInDB(product);

    return {
      statusCode: 200,
      body: JSON.stringify(createdProduct),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
