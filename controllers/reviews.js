const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.insertNewReview = async (req, res) => {
  let { id } = req.params;
  let { rating, comment } = req.body;

  let a_review = new Review({
    rating: rating,
    comment: comment,
    author : req.user._id
  });

  await a_review.save();

  let a_listing = await Listing.findById(id);

  if (!a_listing) {
    throw new ExpressError(404, "Listing not found");
  }
  
  a_listing.reviews.push(a_review._id);
  await a_listing.save();

  req.flash("success", "Review added successfully !");
  req.flash("successType", "flash-white");

  res.redirect("/listings/" + id);
}

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully !");
  req.flash("successType", "flash-white");

  res.redirect("/listings/" + id);
}