import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { getAllProducts } from '../service/productService';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const products = await getAllProducts();

    return {
      statusCode: 200,
      body: products,
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
