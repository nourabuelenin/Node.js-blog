const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const auth = require("./../middlewares/auth");
const restrictTo = require("./../middlewares/restrictTo");

// POST /users/signup -> create a new user
router.post("/signup", usersController.signup);
// POST /users/login -> login a user
router.post("/login", usersController.login);
// GET /users -> get all users
router.get("/", auth, restrictTo("admin"), usersController.getUsers);
// GET /users/:id -> get a user by id
router.get("/:id", usersController.getUserById);
// PUT /users/:id -> update a user by id
router.put("/:id", usersController.updateUserById);
// DELETE /users/:id -> delete a user by id
router.delete("/:id", usersController.deleteUserById);

module.exports = router;
