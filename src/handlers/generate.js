const AWS = require('aws-sdk');

export const generate = (event, context, callback) => {
  event.Records.forEach((record) => {
    console.log('Stream record: ', JSON.stringify(record, null, 2));

    if (record.eventName == 'INSERT') {
      const id = JSON.stringify(record.dynamodb.NewImage.id.S);
      const text = JSON.stringify(record.dynamodb.NewImage.text.S);
      const name = JSON.stringify(record.dynamodb.NewImage.name.S);
      generateMP3(text, name);
    }
  });

  callback(null, `Successfully processed ${event.Records.length} records.`);
};

function generateMP3(text, name) {
  const Polly = new AWS.Polly();

  const params = {
    OutputFormat: 'mp3',
    SampleRate: '8000',
    Text: text,
    TextType: 'text',
    VoiceId: name,
  };

  Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.error(err.code);
    } else if (data) {
      if (data.AudioStream instanceof Buffer) {
        console.log(JSON.stringify(data.AudioStream));
      }
    }
  });
}
