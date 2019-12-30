const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });

const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMO_TABLE;

async function checker(email) {
  console.log("in checker");
  console.log("checker email", email);

  // const params = {
  //   TableName: TABLE_NAME,
  //   IndexName: "userIndex",
  //   KeyConditionExpression: "#userIndex = :index",
  //   ExpressionAttributeNames: { "#userIndex": "user_id" },
  //   ExpressionAttributeValues: {
  //     ":index": { S: id }
  //   }
  // };

  const params = {
    TableName: TABLE_NAME,
    Key: {
      email: email
    }
  };
  console.log("params: ", params);

  return await dynamo
    .get(params)
    .promise()
    .then(async user => {
      console.log("user: ", user);

      if (user) return user;
      else Promise.reject("No user found");
    })
    .catch(err => {
      Promise.reject(new Error(err));
    });
}

module.exports = checker;
