const querystring = require('querystring');
const AWS = require('aws-sdk');

export const submit = (event, context, callback) => {
  const requestBody = querystring.parse(event.body);
  const { text, name } = requestBody;

  dbCreateItem('123', text, name);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      text,
      name,
    }),
  };

  callback(null, response);
};

function dbCreateItem(id, text, name) {
  const docClient = new AWS.DynamoDB.DocumentClient();

  const table = 'voiceMailChangerTable';

  const params = {
    TableName: table,
    Item: {
      id,
      text,
      name,
    },
  };

  console.log('Adding a new item...');
  docClient.put(params, (err, data) => {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
    }
  });
}
