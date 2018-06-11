const querystring = require('querystring');
const { DynamoDB } = require('aws-sdk');

function loginUser(phone, password, callback) {
  const ddb = new DynamoDB();

  const params = {
    ExpressionAttributeValues: {
      ':pass': {
        S: password,
      },
      ':phone': {
        S: phone,
      },
    },
    FilterExpression: 'password = :pass AND phone = :phone',
    ProjectionExpression: 'id',
    TableName: 'voicemailChangerUsers',
  };

  ddb.scan(params, (err, data) => {
    let response;
    if (err) {
      console.log(err, err.stack);
      response = {
        statusCode: 500,
        body: JSON.stringify({}),
      };
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          id: data.Items[0].id.S,
        }),
      };
    }
    callback(null, response);
  });
}

export const login = (event, context, callback) => {
  const requestBody = querystring.parse(event.body);
  const { phone, password } = requestBody;

  loginUser(phone, password, callback);
};
