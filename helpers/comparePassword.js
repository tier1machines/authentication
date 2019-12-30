const bcrypt = require("bcryptjs");

const signToken = require("./signToken");

function comparePassword(password, userPassword, userId, email) {
  return bcrypt.compare(password, userPassword).then(isValid => {
    if (isValid) {
      console.log("compare password valid");
      return signToken(userId, email);
    } else {
      return Promise.reject(new Error("The Credentials do not match"));
    }
  });
}

module.exports = comparePassword;
