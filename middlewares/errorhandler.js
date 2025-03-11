const APIError = require("../util/APIError");

const errorHandler = (err, req, res, next) => {
  //1-  validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({ status: "failure", message: err.message });
  }

  //2- duplicate key error
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ status: "failure", message: "Duplicate key error" });
  }

  //3- cast error
  if (err.name === "CastError") {
    return res.status(400).json({ status: "failure", message: "Invalid ID" });
  }

  //4- jwt error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ status: "failure", message: "Unauthorized" });
  }

  console.error(err.stack);
  if (err instanceof APIError) {
    return res
      .status(err.statusCode)
      .json({ status: "failure", message: err.message });
  }

  // umhandeld || non operational errors
  res.status(500).json({ status: "failure", message: "Internal Server Error" });
};

module.exports = errorHandler;
