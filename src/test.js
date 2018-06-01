function generateRandomNum() {
  return Math.floor(Math.random() * 7);
}

export const randomNumber = (event, context, callback) => {
  const number = generateRandomNum();
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      randomNum: number,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message, event });
};
