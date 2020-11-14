import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getProductById } from '../services/productService';
import { logLambdaRequest } from '../services/utils/logger.utils';

export const getProductsById: APIGatewayProxyHandler = async event => {
  logLambdaRequest(event);

  try {
      const { productId } = event.pathParameters;
      const product = await getProductById(productId);

      return {
        statusCode: 200,
        body: JSON.stringify(product),
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
