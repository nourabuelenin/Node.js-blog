const express = require("express");
const postsController = require("./../controllers/posts");
const auth = require("./../middlewares/auth");
const router = express.Router();

router.post("/", auth, postsController.createPost);
router.get("/", postsController.getPosts);
router.get("/:id", postsController.getPost);
router.patch("/:id", postsController.updatePost);
router.delete("/:id", postsController.deletePost);

module.exports = router;
