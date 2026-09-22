const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

const { sampleListings } = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const reviewComments = [
  "Amazing place and really enjoyed the stay.",
  "The location was beautiful and peaceful.",
  "Everything was clean and comfortable.",
  "Had a wonderful experience here.",
  "The property was exactly as described.",
  "Really nice place for a vacation.",
  "The host was friendly and helpful.",
  "Beautiful surroundings and a comfortable stay.",
  "Would definitely consider staying here again.",
  "Great experience overall.",
];

const usernames = [
  "traveler01",
  "wanderer02",
  "explorer03",
  "backpacker04",
  "tourist05",
  "adventurer06",
  "nomad07",
  "journey08",
  "traveler09",
  "explorer10",
];

const emails = [
  "traveler01@example.com",
  "wanderer02@example.com",
  "explorer03@example.com",
  "backpacker04@example.com",
  "tourist05@example.com",
  "adventurer06@example.com",
  "nomad07@example.com",
  "journey08@example.com",
  "traveler09@example.com",
  "explorer10@example.com",
];

async function main() {
  await mongoose.connect(MONGO_URL);

  console.log("Connected to MongoDB");

  // --------------------------------
  // CLEAR OLD DATA
  // --------------------------------

  await Review.deleteMany({});
  await Listing.deleteMany({});
  await User.deleteMany({});

  console.log("Old data deleted");

  // --------------------------------
  // CREATE USERS
  // --------------------------------

  const users = [];

  for (let i = 0; i < usernames.length; i++) {
    const user = new User({
      username: usernames[i],
      email: emails[i],
    });

    const registeredUser = await User.register(
      user,
      "password123"
    );

    users.push(registeredUser);
  }

  console.log(`${users.length} users created`);

  // --------------------------------
  // CREATE LISTINGS
  // --------------------------------

  const listings = [];

  for (let i = 0; i < sampleListings.length; i++) {
    const data = sampleListings[i];

    const listing = new Listing({
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      country: data.country,

      image: {
        url: "https://static.vecteezy.com/system/resources/thumbnails/007/508/093/small/comfortable-cottage-for-family-members-semi-flat-color-object-vector.jpg",
        filename: "default-image",
      },

      owner: users[i % users.length]._id,

      geometry: {
        type: "Point",
        coordinates: data.coordinates,
      },
    });

    await listing.save();

    listings.push(listing);
  }

  console.log(`${listings.length} listings created`);

  // --------------------------------
  // CREATE REVIEWS
  // --------------------------------

  let totalReviews = 0;

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];

    for (let j = 0; j < 10; j++) {
      // Make sure reviewer is not the listing owner
      let reviewerIndex = (i + j + 1) % users.length;

      const review = new Review({
        comment: reviewComments[j],
        rating: ((i + j) % 5) + 1,
        author: users[reviewerIndex]._id,
      });

      await review.save();

      listing.reviews.push(review._id);

      totalReviews++;
    }

    await listing.save();
  }

  console.log(`${totalReviews} reviews created`);

  console.log("================================");
  console.log("DATABASE SEEDED SUCCESSFULLY");
  console.log("================================");
  console.log(`Users: ${users.length}`);
  console.log(`Listings: ${listings.length}`);
  console.log(`Reviews: ${totalReviews}`);

  await mongoose.connection.close();
}

main().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});