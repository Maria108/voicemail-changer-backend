const { DynamoDB } = require('aws-sdk');
const { Carriers } = require('../utils/carriers');

// Gets user info from DynamoDB table.
const getUserInfo = phone =>
  new Promise((resolve, reject) => {
    const ddb = new DynamoDB();
    const ddbParams = {
      ExpressionAttributeValues: {
        ':phone': {
          S: phone,
        },
      },
      KeyConditionExpression: 'phone = :phone',
      ExpressionAttributeNames: {
        '#NA': 'name',
        '#CA': 'carrier',
        '#PI': 'pin',
        '#TE': 'text',
      },
      ProjectionExpression: '#NA, #CA, #PI, #TE',
      TableName: 'voicemailChangerUsers',
    };

    // Search for a specific item.
    ddb.query(ddbParams, (err, data) => {
      if (err) { // an error occurred
        console.log(err, err.stack);
        reject(err.stack);
      } else { // successful response
        console.log(data);
        const { Items } = data;
        // Users are unique, so it will be only one user per phone number.
        resolve(Items[0]);
      }
    });
  });

// Forwards phone calls.
export const changer = async (event, context, callback) => {
  // Get caller phone number.
  const { From: phone } = event.body;

  const userInfo = await getUserInfo(phone);
  const carrier = userInfo.carrier.S;
  const pin = userInfo.pin.S;
  const text = userInfo.text.S;

  const carriers = new Carriers(pin, text);
  const xml = carriers[carrier]();
  console.log(xml);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: {
      message: xml,
      input: JSON.stringify(event),
    },
  };

  callback(null, response);
};
