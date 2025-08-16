const { Router } = require("express");
const User = require("../models/user");
const router = Router();
const {
  handleUserSignIn,
  handleUserSignUp,
  handleUserDelete,
} = require("../controllers/user");
const { isLoggedIn } = require("../middlewares/auth");

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", handleUserSignIn);

router.post("/signup", handleUserSignUp);

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/delete-account/:id", isLoggedIn, handleUserDelete);

module.exports = router;
