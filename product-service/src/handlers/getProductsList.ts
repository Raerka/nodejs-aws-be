import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getAllProducts } from '../services/productService';
import { logLambdaRequest } from '../services/utils/logger.utils';

export const getProductsList: APIGatewayProxyHandler = async event => {
  logLambdaRequest(event);

  try {
    const products = await getAllProducts();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
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
