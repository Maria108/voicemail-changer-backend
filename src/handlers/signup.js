const querystring = require('querystring');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

export const signup = (event, context, callback) => {
  const requestBody = querystring.parse(event.body);
  const { phone } = requestBody;

  dbCreateItem(phone);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      phone,
    }),
  };

  callback(null, response);
};

function dbCreateItem(phone) {
  const ddb = new AWS.DynamoDB();
  const password = uuidv4().split('-')[0];

  const params = {
    TableName: 'voicemailChangerUsers',
    Item: {
      id: { S: uuidv4() },
      password: { S: password },
      phone: { S: phone },
    },
  };

  console.log('Adding a new item...');
  ddb.putItem(params, (err, data) => {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
    }
  });
}
