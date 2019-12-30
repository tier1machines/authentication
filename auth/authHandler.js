const jwt = require("jsonwebtoken");

const register = require("./../helpers/register");
const login = require("./../helpers/login");
const checker = require("./../helpers/checker");

const authHandler = {};

authHandler.register = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log(event.body);
  const eventBody = JSON.parse(event.body);
  // const eventBody = event.body;
  console.log("Event Body in authHandler register: ", eventBody);

  return register(eventBody)
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message
    }));
};

authHandler.login = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log(event.body);
  const eventBody = JSON.parse(event.body);
  // const eventBody = event.body;
  console.log("Event Body in authHandler login: ", eventBody);

  return login(eventBody)
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message
    }));
};

authHandler.checker = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("checker");

  console.log("event: ", event);
  console.log("event.requestContext: ", event.requestContext);
  // console.log(
  //   "event.requestContext.authorizer: ",
  //   event.requestContext.authorizer
  // );
  // console.log(
  //   "event.requestContext.authorizer.principalId: ",
  //   event.requestContext.authorizer.principalId
  // );

  console.log("event.headers: ", event.headers);
  console.log("event.headers.Authorization: ", event.headers.Authorization);

  const token = event.headers.Authorization;
  const trimmedToken = token.replace("Bearer", "").trim();
  const decoded = jwt.decode(trimmedToken);
  console.log("decoded: ", decoded);
  const decodedEmail = decoded.email;

  if (!token) return callback(null, "Unauthorized");

  // jwt.verify(trimmedToken, process.env.JWT_SECRET, (err, decoded) => {
  //   console.log("in verify");
  //   console.log(err);
  //   console.log(decoded);
  //   if (err) return callback(null, "Unauthorized");

  //   // if everything is good, save to request for use in other routes
  //   console.log("token verified. Will generate policy");
  //   decodedEmail = decoded.email;
  // });

  // return checker(event.requestContext.authorizer.principalId)
  return checker(decodedEmail)
    .then(session => {
      console.log("session: ", session);
      return {
        statusCode: 200,
        body: JSON.stringify(session)
      };
    })
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: { stack: err.stack, message: err.message }
    }));
};

module.exports = authHandler;
