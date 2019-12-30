const AWS = require("aws-sdk");
const comparePassword = require("./comparePassword");

AWS.config.update({ region: "us-east-2" });

const dynamo = new AWS.DynamoDB.DocumentClient();

// const TABLE_NAME = "Virtual-DJ";
const TABLE_NAME = process.env.DYNAMO_TABLE;

async function login(eventBody) {
  console.log("in login");
  console.log("login eventbody", eventBody);

  const params = {
    TableName: TABLE_NAME,
    Key: {
      email: eventBody.email
    }
  };

  return await dynamo
    .get(params)
    .promise()
    .then(async user => {
      console.log("user: ", user);
      if (user) {
        console.log("eventbody password: ", eventBody.password);
        console.log("user password: ", user.Item.password);
        console.log("user id: ", user.Item.user_id);
        console.log("user id: ", user.Item.email);
        const token = await comparePassword(
          eventBody.password,
          user.Item.password,
          user.Item.user_id,
          user.Item.email
        );
        console.log("token: ", token);
        if (token) {
          return {
            user: user,
            auth: true,
            token: token
          };
        }
      } else Promise.reject(new Error("User with that email does not exist."));
    });
}

module.exports = login;
