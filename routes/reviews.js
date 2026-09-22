const express = require("express");
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js");
const reviewController = require("../controllers/reviews.js");

router.post("/", isLoggedIn, validateReview, reviewController.insertNewReview);
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.destroyReview);

module.exports = router;
