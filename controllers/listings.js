const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let { search } = req.query;

  let allListings;

  if (search) {
    allListings = await Listing.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ],
    }).populate("reviews");
  } else {
    allListings = await Listing.find({}).populate("reviews");
  }

  res.locals.noListings = search && allListings.length === 0;

  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.renderListingShowPage = async (req, res) => {
  const { id } = req.params;
  const a_listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!a_listing) {
    req.flash("success", "No such listing found !");
    req.flash("successType", "flash-red");

    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing: a_listing });
};

module.exports.renderListingEditPage = async (req, res) => {
  let { id } = req.params;

  let a_listing = await Listing.findById(id);

  if (!a_listing) {
    req.flash("success", "No such listing found !");
    req.flash("successType", "flash-red");

    return res.redirect("/listings");
  }
  let orgImgUrl = a_listing.image.url;
  let changedImgUrl = orgImgUrl.replace("/upload", "/upload/h_150,w_150");

  res.render("listings/edit.ejs", { listing: a_listing, changedImgUrl });
};

module.exports.insertNewListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.location}, ${req.body.country}`,
      limit: 1,
    })
    .send();

  let { title, description, price, location, country } = req.body;

  let listingData = {
    title,
    description,
    price,
    location,
    country,
    owner: req.user._id,
    geometry: response.body.features[0].geometry,
  };

  if (req.file) {
    listingData.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  let newListing = await Listing.insertOne(listingData);

  req.flash("newListingAdded", "New");
  req.flash("newListingId", newListing._id);
  req.flash("success", "New listing added successfully !");
  req.flash("successType", "flash-green");

  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let { title, description, price, location, country } = req.body;

  let updatedData = { title, description, price, location, country };

  if (req.file) {
    updatedData.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await Listing.findByIdAndUpdate(id, updatedData);

  req.flash("success", "Listing updated successfully !");
  req.flash("successType", "flash-yellow");

  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully !");
  req.flash("successType", "flash-red");

  res.redirect("/listings");
};

module.exports.myListings = async (req, res) => {
  const allListings = await Listing.find({
    owner: req.user._id,
  }).populate("reviews");

  res.locals.noListings = allListings.length === 0;
  res.render("listings/index.ejs", { allListings });
};
