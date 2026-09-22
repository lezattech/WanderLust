const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectURL } = require("../middlewares.js");
const userController = require("../controllers/users.js");
const User = require("../models/user.js");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      if (req.session.googleProfile) {
        return res.redirect("/google/signup");
      }

      req.flash("error", "Google login failed.");
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/listings");
    });
  })(req, res, next);
});

router
  .route("/signup")
  .get(userController.renderUserSignupPage)
  .post(userController.userSignup);

router.get("/google/signup", (req, res) => {
  if (!req.session.googleProfile) {
    return res.redirect("/login");
  }

  res.render("users/googleSignup", {
    googleProfile: req.session.googleProfile,
  });
});

router.post("/google/signup", async (req, res, next) => {
  try {
    const { username } = req.body;
    const googleProfile = req.session.googleProfile;

    if (!googleProfile) {
      return res.redirect("/login");
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      req.flash("error", "Username already taken!");
      return res.redirect("/google/signup");
    }

    const user = await User.create({
      username: username.trim(),
      email: googleProfile.email,
      googleId: googleProfile.googleId,
    });

    delete req.session.googleProfile;

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (err) {
    next(err);
  }
});

router
  .route("/login")
  .get(userController.renderUserLoginPage)
  .post(
    saveRedirectURL,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.userLogin,
  );

router.get("/logout", userController.userLogout);

module.exports = router;
