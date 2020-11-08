import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getProductById } from '../service/productService';

export const getProductsById: APIGatewayProxyHandler = async event => {
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
        statusCode: 404,
        body: 'Product was not found',
      };
    }
  };
