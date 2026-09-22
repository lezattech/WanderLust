const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listings.js");
const Listing = require("../models/listing.js");

const { storage } = require("../cloudConfig.js");

const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(listingController.index)
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    listingController.insertNewListing,
  );

router.get("/user", isLoggedIn, listingController.myListings);

router.get("/new", isLoggedIn, listingController.renderNewListingForm);
router
  .route("/:id")
  .get(listingController.renderListingShowPage)
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    listingController.updateListing,
  )
  .delete(isLoggedIn, isOwner, listingController.destroyListing);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  listingController.renderListingEditPage,
);

module.exports = router;
