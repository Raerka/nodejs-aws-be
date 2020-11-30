import 'source-map-support/register';

// @ts-ignore
export const basicAuthorizer = async (event, ctx, cb) => {
  console.log('Event:', JSON.stringify(event));

  if (event['type']) {
    cb('Unauthorized');
  }

  try {
    const authorizationToken = event.authorizationToken;
    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8');
    const [username, password] = plainCreds.split(':');

    console.log(`username: ${username}. password: ${password}`);

    const storedPassword = process.env[username];
    const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    cb(null, policy);
  } catch (error) {
    console.log('Error:', error);
    cb('Unauthorized');
  }
};

const generatePolicy = (principalId, resource, effect = 'Deny') => (
  {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  }
);
