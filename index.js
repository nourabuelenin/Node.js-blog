const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("express-async-errors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const limiter = require("./middlewares/rate-limiter");

dotenv.config();

// import ROUTES
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");
// UTILS
const APIError = require("./util/APIError");

// import MIDDLEWARES
const errorHandler = require("./middlewares/errorhandler");

// create express app
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(limiter);

// ROUTES
const V1_PREFIX = "/api/v1";
app.use(`${V1_PREFIX}/users`, usersRoutes);
app.use(`${V1_PREFIX}/posts`, postsRoutes);
// handling not found routes
app.use((req, res, next) => {
  next(new APIError(`${req.method} ${req.path} is not found`, 404));
});

// Global error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });
});
