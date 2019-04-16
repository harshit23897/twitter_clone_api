const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const port = process.env.PORT || 8000;
const redis = require("redis");
const session = require("express-session");
require("dotenv").config();

const RedisStore = require("connect-redis")(session);

const app = express();

const users = require("./lib/routes/api/users");
const tweet = require("./lib/routes/api/tweet");

// Express session middleware.
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      host: "localhost",
      port: 6379,
      client: redis.createClient()
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to database
mongoose
  .connect("mongodb://localhost/twitterdb")
  .then(() => console.log("Mongodb connected"))
  .catch(error => console.log(error));

// Use Routes
app.use("/api/users", users);
app.use("/api/tweet", tweet);

app.listen(port, () => console.log(`Server running on port ${port}`));
