const { Router } = require("express");
const { isLoggedIn } = require("../middlewares/auth");
const path = require("path");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");
const {
  getAddNewPage,
  getMyProfile,
  getMyBlogs,
  getBlogById,
  postComment,
  createBlog,
  updateProfile,
  upload,
  handleDeleteBlog,
  handleEditGetRequest,
  handleEditPostRequest,
} = require("../controllers/blog");

const router = Router();

router.get("/add-new", getAddNewPage);
router.get("/my-profile", isLoggedIn, getMyProfile);
router.get("/my", getMyBlogs);
router.get("/:id", getBlogById);
router.post("/comment/:blogid", postComment);
router.post("/", upload.single("coverImage"), createBlog);
router.post(
  "/update-profile",
  isLoggedIn,
  upload.single("profileImage"),
  updateProfile,
);
// Edit form
router.get("/edit/:id", isLoggedIn, handleEditGetRequest);

// Update blog
router.post(
  "/edit/:id",
  isLoggedIn,
  upload.single("coverImage"),
  handleEditPostRequest,
);

router.post("/delete/:id", handleDeleteBlog);

module.exports = router;
