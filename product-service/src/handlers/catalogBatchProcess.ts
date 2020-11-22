import 'source-map-support/register';
import { createProductInDB } from '../services/productService';
import * as AWS from 'aws-sdk';

export const catalogBatchProcess = async event => {
  console.log('Event:', event);

  try {
    const products = event.Records
      .map(record => {
        const product = JSON.parse(record.body);

        return {
          description: product.description,
          title: product.title,
          count: +product.count,
          price: +product.price,
        };
      });

    const created = await Promise.all(products.map(async product => {
      try {
        return await createProductInDB(product);
      } catch (err) {
        console.error(`Error: ${err}. Product: ${product}`);

        return null;
      }
    }));

    const sns = new AWS.SNS({ region: 'eu-west-1' });

    await new Promise((resolve, reject) => {
      sns.publish(
        {
          Subject: 'Products were parsed and uploaded',
          Message: `Products: ${JSON.stringify(created)}`,
          TopicArn: process.env.SNS_TOPIC,
        },
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          console.log(`Send Notification about product: ${JSON.stringify(created)}`);
          resolve(data);
        },
      );
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: '',
    };
  } catch (error) {
    console.log('Error:', error);

    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
