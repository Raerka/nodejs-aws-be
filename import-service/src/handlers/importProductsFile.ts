import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const importProductsFile: APIGatewayProxyHandler = async event => {
  console.log('Event: ', event);

  const FILE_NAME = event.queryStringParameters.name;
  const FILE_PATH = `uploaded/${FILE_NAME}`;

  const s3 = new AWS.S3({
    region: 'eu-west-1',
    signatureVersion: 'v4',
  });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: FILE_PATH,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);

    return {
      statusCode: 200,
      body: url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  } catch (error) {
    console.log('Error:', error);

    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'Internal Server Error',
    };
  }
};
