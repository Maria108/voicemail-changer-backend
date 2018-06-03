const querystring = require('querystring');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

export const submit = (event, context, callback) => {
  const requestBody = querystring.parse(event.body);
  const { text, name } = requestBody;

  dbCreateItem(text, name);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      text,
      name,
    }),
  };

  callback(null, response);
};

function dbCreateItem(text, name) {
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

  const params = {
    TableName: 'voiceMailChangerTable',
    Item: {
      id: { S: uuidv4() },
      text: { S: text },
      name: { S: name },
      status: { S: 'PENDING' },
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
