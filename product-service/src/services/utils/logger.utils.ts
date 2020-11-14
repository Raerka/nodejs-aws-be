export const logLambdaRequest = event => {
  let log = '';

  log += `Method: ${event.httpMethod}. `;
  log += `Path: ${event.resource}. `;

  if (event.queryStringParameters) {
    log += `Query: ${JSON.stringify(event.queryStringParameters)}. `;
  }

  if (event.pathParameters) {
    log += `Parameters: ${JSON.stringify(event.pathParameters)}. `;
  }
  if (event.body) {
    log += `Body: ${event.body}. `;
  }
  console.log(log);
};
