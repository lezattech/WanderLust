const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectURL = req.originalUrl;
    req.flash("success", "Log in to WanderLust first !");
    req.flash("successType", "flash-red");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let a_listing = await Listing.findById(id);
  if (!a_listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("success", "You don't have permission to make these changes !");
    req.flash("successType", "flash-red");

    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.details[0].message);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.details[0].message);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let a_review = await Review.findById(reviewId);
  if (!a_review) {
    throw new ExpressError(404, "Review not found");
  }
  
  if (!a_review.author.equals(res.locals.currentUser._id)) {
    req.flash("success", "You don't have permission to make these changes !");
    req.flash("successType", "flash-red");

    return res.redirect(`/listings/${id}`);
  }

  next();
};
