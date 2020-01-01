const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v1");

const signToken = require("./signToken");

AWS.config.update({ region: "us-east-2" });

const dynamo = new AWS.DynamoDB.DocumentClient();

// const TABLE_NAME = "Virtual-DJ";
const TABLE_NAME = process.env.DYNAMO_TABLE;

async function register(eventBody) {
  console.log("in register");
  console.log(eventBody.password);
  const password = await bcrypt.hash(eventBody.password, 8);

  const params = {
    TableName: TABLE_NAME,
    Item: {
      user_id: uuid(),
      email: eventBody.email,
      password: password,
      firstname: eventBody.firstname,
      lastname: eventBody.lastname
    }
  };

  console.log("Eventbody in register: ", eventBody);
  console.log("params: ", params);

  return await dynamo
    .put(params)
    .promise()
    .then(user => {
      console.log("user: ", user);
      return {
        // user: params.Item,
        auth: true,
        token: "Bearer " + signToken(params.Item.user_id, params.Item.email)
      };
    });
}

module.exports = register;
