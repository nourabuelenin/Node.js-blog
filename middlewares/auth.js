const jwt = require("jsonwebtoken");
const util = require("util");
const APIError = require("./../util/APIError");
const User = require("./../models/users");

const jwtVerify = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = await jwtVerify(token, process.env.JWT_SECRET);
  const user = await User.findById(userId).select("name email role");
  req.user = user;
  next();
};

module.exports = auth;
