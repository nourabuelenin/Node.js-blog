const APIError = require("../util/APIError");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const util = require("util");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

const jwtSign = util.promisify(jwt.sign);

const signup = async (req, res, next) => {
  const data = req.body;
  if (!data.password || !data.passwordConfirm) {
    throw new APIError("password and passwordConfirm are required", 400);
  }
  if (data.password !== data.passwordConfirm) {
    throw new APIError("password and passwordConfirm must be the same", 400);
  }
  // hash password
  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const newUser = await User.create({
    ...data,
    role: "user",
    password: hashedPassword,
  });
  res.status(201).json({ status: "success", data: { user: newUser } });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new APIError("email and password are required", 400);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new APIError("Invalid Email or Password", 400);
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new APIError("Invalid Email or Password", 400);
  }

  // const randomBytes = crypto.randomBytes(64).toString("hex");
  // console.log("random bbytes:", randomBytes);

  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  const token = await jwtSign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.status(200).json({ status: "success", data: { token } });
};

const getUsers = async (req, res) => {
  const users = await User.find({ role: "user" });
  if (!users) {
    throw new APIError("No users found", 404);
  }
  res
    .status(200)
    .json({ status: "success", data: { length: users.length, users } });
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate("posts");
  if (!user) {
    throw new APIError(`user with id: ${userId} is not found`, 404);
  }
  res.status(200).json({ status: "success", data: { user } });
};

const updateUserById = async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { name: userData.name, email: userData.email },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    throw new APIError(`user with id: ${userId} is not found`, 404);
  }

  res.status(200).json({ status: "success", data: { user: updatedUser } });
};

const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new APIError(`user with id: ${userId} is not found`, 404);
  }
  res.status(204).json();
};

module.exports = {
  signup,
  login,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
