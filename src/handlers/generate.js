const { DynamoDB, Polly, S3 } = require('aws-sdk');

export const generate = (event, context, callback) => {
  event.Records.forEach((record) => {
    console.log('Stream record: ', JSON.stringify(record, null, 2));

    if (record.eventName === 'INSERT') {
      const id = record.dynamodb.NewImage.id.S;
      const text = record.dynamodb.NewImage.text.S;
      const name = record.dynamodb.NewImage.name.S;
      generateMP3(id, text, name);
    }
  });

  callback(null, `Successfully processed ${event.Records.length} records.`);
};

function generateMP3(id, text, name) {
  const polly = new Polly();

  const params = {
    OutputFormat: 'mp3',
    SampleRate: '8000',
    Text: text,
    TextType: 'text',
    VoiceId: name,
  };

  console.log(params);

  polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
      console.error('Error: ', err.code);
    } else if (data) {
      if (data.AudioStream instanceof Buffer) {
        const s3 = new S3();
        const s3Params = {
          ACL: 'public-read', // Make it public.
          Body: data.AudioStream,
          ContentType: data.contentType,
          Bucket: 'voicemail-changer-bucket-mp3',
          Key: `${id}.mp3`,
          StorageClass: 'REDUCED_REDUNDANCY', // Save costs.
        };
        s3.upload(s3Params, (err, data) => {
          if (err) console.log(err, err.stack); // an error occurred

          const { Location } = data;
          console.log('Location: ', Location);

          const ddb = new DynamoDB();
          const ddbParams = {
            ExpressionAttributeNames: {
              '#S': 'status',
              '#U': 'url',
            },
            ExpressionAttributeValues: {
              ':s': {
                S: 'DONE',
              },
              ':u': {
                S: Location,
              },
            },
            Key: {
              id: {
                S: id,
              },
            },
            ReturnValues: 'ALL_NEW',
            TableName: 'voiceMailChangerTable',
            UpdateExpression: 'SET #S = :s, #U = :u',
          };
          ddb.updateItem(ddbParams, (err, data) => {
            if (err) console.log(err, err.stack);
            // an error occurred
            else console.log(data); // successful response
          });
        });
        console.log(JSON.stringify(data.AudioStream));
      }
    }
  });
}
