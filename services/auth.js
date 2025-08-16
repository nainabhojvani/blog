require("dotenv").config();

const JWT = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

function createTokenForUser(user) {
  const payload = {
    _id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    profileImage: user.profileImage,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
