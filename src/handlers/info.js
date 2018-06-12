const querystring = require('querystring');
const { DynamoDB } = require('aws-sdk');

function dbUpdateUserInfo(params) {
  const {
    id, name, carrier, pin, text, phone,
  } = params;
  const ddb = new DynamoDB();
  const ddbParams = {
    ExpressionAttributeNames: {
      '#NA': 'name',
      '#C': 'carrier',
      '#P': 'pin',
      '#T': 'text',
    },
    ExpressionAttributeValues: {
      ':na': {
        S: name,
      },
      ':c': {
        S: carrier,
      },
      ':p': {
        S: pin,
      },
      ':t': {
        S: text,
      },
    },
    Key: {
      phone: {
        S: phone,
      },
    },
    TableName: 'voicemailChangerUsers',
    UpdateExpression: 'SET #NA = :na, #C = :c, #P = :p, #T = :t',
  };
  ddb.updateItem(ddbParams, (err, data) => {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });
}

export const info = (event, context, callback) => {
  const requestBody = querystring.parse(event.body);

  dbUpdateUserInfo(requestBody);

  const response = {
    statusCode: 200,
    body: JSON.stringify({}),
  };

  callback(null, response);
};
