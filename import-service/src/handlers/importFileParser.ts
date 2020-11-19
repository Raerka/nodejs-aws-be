import 'source-map-support/register';
import * as AWS from 'aws-sdk';
// @ts-ignore
import csvParser from 'csv-parser';

export const importFileParser = async event => {
  console.log('Event:', event);

  try {
    const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    for (const record of event.Records) {
      const { key } = record.s3.object;
      console.log(key);

      await new Promise((resolve, reject) => {
        s3.getObject({
          Bucket: S3_BUCKET_NAME,
          Key: key,
        })
          .createReadStream()
          .on('error', error => {
            reject(error);
            console.log('Error:', error);
          })
          .pipe(csvParser())
          .on('open', () => {
            console.log(`Parsing file ${key}`);
          })
          .on('data', data => {
            console.log('Parsed data:', data);
          })
          .on('error', error => {
            reject(error);
            console.log('Error:', error);
          })
          .on('end', async () => {
            console.log('Finish callback');
            resolve();
          });
      });

      console.log(`Moving from ${S3_BUCKET_NAME}/${key}`);
      const newKey = key.replace('uploaded', 'parsed');

      await s3.copyObject({
        Bucket: S3_BUCKET_NAME,
        CopySource: `${S3_BUCKET_NAME}/${key}`,
        Key: newKey,
      }).promise();

      await s3.deleteObject({
        Bucket: S3_BUCKET_NAME,
        Key: key,
      }).promise();

      console.log(`Moved to ${S3_BUCKET_NAME}/${newKey}`);
    }

    return {
      statusCode: 200,
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
