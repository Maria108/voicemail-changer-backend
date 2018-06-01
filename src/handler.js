export const hello = (event, context, callback) => {
  const message = 'Hello Masha!';
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message, event });
};
