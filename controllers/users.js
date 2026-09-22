const User = require("../models/user.js");


module.exports.renderUserSignupPage = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.userSignup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });

    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Registered successfully !");
      req.flash("successType", "flash-green");

      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("success", e.message);
    req.flash("successType", "flash-red");

    res.redirect("/signup");
  }
}

module.exports.renderUserLoginPage = (req, res) => {
  res.render("users/login.ejs",   );
}

module.exports.userLogin = async (req, res) => {
    req.flash("success", "Welcome Back !");
    req.flash("successType", "flash-green");

    let redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);
  }

module.exports.userLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "Logged out !");
    req.flash("successType", "flash-yellow");

    res.redirect("/listings");
  });
}