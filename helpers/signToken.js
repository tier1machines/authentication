const jwt = require("jsonwebtoken");

function signToken(id, email) {
  console.log("sign token id: ", id);
  console.log("sign token email: ", email);
  return jwt.sign({ id: id, email: email }, process.env.JWT_SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
}

module.exports = signToken;
