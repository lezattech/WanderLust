if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const PORT = 8080;
const path = require("path");
const mo = require("method-override");
const mongoose = require("mongoose");
const db_URL = process.env.ATLASDB_URL;
const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/users.js");
const MongoStore = require("connect-mongo").default;
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(mo("__method"));
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("Connected to DB ...");
  })
  .catch((err) => {
    console.log("Something went wrong ...\n", err);
  });

async function main() {
  await mongoose.connect(db_URL);
}

const store = MongoStore.create({
  mongoUrl: db_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE !");
  throw new ExpressError(500, "Error in MONGO SESSION STORE !");
});

const sessionOptions = {
  store: store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi ! I'm root page !!");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
      passReqToCallback: true,
    },

    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        req.session.googleProfile = {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        };

        return done(null, false);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(async (req, res, next) => {
  const listingsForSearch = await Listing.find({}, "title");
  res.locals.searchDestinations = listingsForSearch;

  res.locals.currentUser = req.user;

  if (req.user) {
    res.locals.userListingCount = await Listing.countDocuments({
      owner: req.user._id,
    });
  } else {
    res.locals.userListingCount = 0;
  }

  res.locals.newListingMsg = req.flash("newListingAdded")[0];
  res.locals.newListingId = req.flash("newListingId")[0];
  res.locals.success = req.flash("success")[0];
  res.locals.successType = req.flash("successType")[0];

  res.locals.error = req.flash("error")[0];
  res.locals.errorType = "flash-red";
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page not found !"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error", { statusCode, message });
});

app.listen(PORT, () => {
  console.log("Listening to PORT - ", PORT);
});
