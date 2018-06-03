const AWS = require('aws-sdk');

export const generate = (event, context, callback) => {
  event.Records.forEach((record) => {
    console.log('Stream record: ', JSON.stringify(record, null, 2));

    if (record.eventName == 'INSERT') {
      const id = record.dynamodb.NewImage.id.S;
      const text = record.dynamodb.NewImage.text.S;
      const name = record.dynamodb.NewImage.name.S;
      generateMP3(id, text, name);
    }
  });

  callback(null, `Successfully processed ${event.Records.length} records.`);
};

function generateMP3(id, text, name) {
  const Polly = new AWS.Polly();

  const params = {
    OutputFormat: 'mp3',
    SampleRate: '8000',
    Text: text,
    TextType: 'text',
    VoiceId: name,
  };

  console.log(params);

  Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.error('Error: ', err.code);
    } else if (data) {
      if (data.AudioStream instanceof Buffer) {
        const s3 = new AWS.S3();
        const s3Params = {
          Body: data.AudioStream,
          Bucket: 'voicemail-changer-bucket',
          Key: `${id}.mp3`,
        };
        s3.putObject(s3Params, (err, data) => {
          if (err) console.log(err, err.stack);
          // an error occurred
          else console.log(data); // successful response
        });
        console.log(JSON.stringify(data.AudioStream));
      }
    }
  });
}
