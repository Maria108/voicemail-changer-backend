const { DynamoDB } = require('aws-sdk');
const twilio = require('twilio');

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
export const call = async (event, context, callback) => {
  // console.log(JSON.stringify(event.body));

  // Some carriers require to call a custom number.
  const voicemails = {
    mint: '+18056377456',
  };

  // Get caller phone number.
  const { From: callerId } = event.body;
  const userInfo = await getUserInfo(callerId);

  // Set custom voicemail number or call same number as caller.
  const vmPhoneNumber = voicemails[userInfo.carrier.S] || callerId;

  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say({
    voice: 'woman',
  }, `Hello ${userInfo.name.S}! Thanks for using voicemail changer, please wait while we are updating your settings!`);

  const dial = twiml.dial({
    callerId,
    timeLimit: 1800,
  });

  dial.number({
    url: 'https://vmchanger.abashina.org/changer',
  }, vmPhoneNumber);

  twiml.say({
    voice: 'woman',
  }, 'Congrats! Your voicemail has been updated! Buy!');

  twiml.hangup();

  console.log(`twiml: ${twiml.toString()}`);

  const response = {
    statusCode: 200,
    body: {
      message: twiml.toString(),
      input: JSON.stringify(event),
    },
  };

  callback(null, response);
};
