const path = require("path");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");

async function getAddNewPage(req, res) {
  const dbUser = await User.findById(req.user._id);
  return res.render("addblog", { user: dbUser, blog: null });
}

async function getMyProfile(req, res) {
  try {
    const dbUser = await User.findById(req.user._id);
    const blogCount = await Blog.countDocuments({ createdBy: req.user._id });
    const commentCount = await Comment.countDocuments({
      createdBy: req.user._id,
    });
    res.render("myProfile", { user: dbUser, blogCount, commentCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function getMyBlogs(req, res) {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }
    const dbUser = await User.findById(req.user._id);
    const blogs = await Blog.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("createdBy");
    res.render("myblogs", { user: dbUser, blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function getBlogById(req, res) {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy",
  );
  return res.render("blog", { user: req.user, blog, comments });
}

async function postComment(req, res) {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogid,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogid}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

async function createBlog(req, res) {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
}

async function updateProfile(req, res) {
  try {
    const updates = {
      fullName: req.body.fullName,
      bio: req.body.bio,
      email: req.body.email,
    };
    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }
    await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    return res.redirect("/blog/my-profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating profile");
  }
}

async function handleEditGetRequest(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");
    if (String(blog.createdBy) !== String(req.user._id)) {
      return res.status(403).send("Unauthorized");
    }

    res.render("addblog", {
      user: req.user,
      blog,
      isEdit: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function handleEditPostRequest(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");

    if (String(blog.createdBy) !== String(req.user._id)) {
      return res.status(403).send("Unauthorized");
    }

    // Update fields
    blog.title = req.body.title;
    blog.body = req.body.body;

    if (req.file) {
      blog.coverImageURL = `/uploads/${req.file.filename}`;
    }

    await blog.save();
    res.redirect("/blog/my");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

async function handleDeleteBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    if (String(blog.createdBy) !== String(req.user._id)) {
      return res.status(403).send("Unauthorized");
    }

    await blog.deleteOne();
    res.redirect("/blog/my");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

module.exports = {
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
};
