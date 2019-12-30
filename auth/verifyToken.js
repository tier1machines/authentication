const jwt = require("jsonwebtoken");

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports.auth = (event, context, callback) => {
  // check header or url parameters or post parameters for token
  console.log("verify Token");
  const token = event.authorizationToken;
  console.log("token: ", token);
  console.log(token);
  console.log(typeof token);
  console.log(token.replace("Bearer", "").trim());
  const trimmedToken = token.replace("Bearer", "").trim();

  if (!token) return callback(null, "Unauthorized");

  // verifies secret and checks exp
  console.log("pre verify");
  jwt.verify(trimmedToken, process.env.JWT_SECRET, (err, decoded) => {
    console.log("in verify");
    console.log(err);
    console.log(decoded);
    if (err) return callback(null, "Unauthorized");

    // if everything is good, save to request for use in other routes
    console.log("token verified. Will generate policy");
    return callback(null, generatePolicy(decoded.id, "Allow", event.methodArn));
  });
};
