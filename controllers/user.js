const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");
async function handleUserSignUp(req, res) {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  return res.redirect("/");
}

async function handleUserSignIn(req, res) {
  try {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "email or password is incorrect.",
    });
  }
}

async function handleUserDelete(req, res) {
  try {
    const userId = req.params.id;

    // Delete all comments by this user
    await Comment.deleteMany({ createdBy: userId });

    // Find all blogs by this user
    const blogs = await Blog.find({ createdBy: userId });

    // Delete comments related to each blog
    const blogIds = blogs.map((b) => b._id);
    await Comment.deleteMany({ blogId: { $in: blogIds } });

    // Delete all blogs by this user
    await Blog.deleteMany({ createdBy: userId });

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    res.clearCookie("token").redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  handleUserSignUp,
  handleUserSignIn,
  handleUserDelete,
};
