const Post = require("./../models/posts");
const APIError = require("./../util/APIError");

const createPost = async (req, res) => {
  console.log("👉👉req.user in create post controller", req.user);
  const post = await Post.create({ ...req.body, userId: req.user._id });
  res.status(201).json(post);
};

const getPosts = async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const postsCount = await Post.countDocuments();
  const numberOfPages = Math.ceil(postsCount / limit);

  const posts = await Post.find()
    .skip((page - 1) * limit) // get posts for the current page
    .limit(limit);
  if (!posts?.length) {
    throw new APIError("No posts found", 404);
  }

  const pagination = {
    page,
    numberOfPages,
    total: postsCount,
    next: page < numberOfPages,
    prev: page > 1,
  };

  res.status(200).json({ posts, pagination });
};

const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("userId");
  if (!post) {
    throw new APIError("Post not found", 404);
  }

  res.status(200).json(post);
};

const updatePost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw new APIError("Post not found", 404);
  }
  res.status(200).json(post);
};

const deletePost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    throw new APIError("Post not found", 404);
  }
  res.status(204).send();
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
