const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

// Load Input Validation
const validateInput = require("../validation/input");

const User = require("../../models/User");
const Following = require("../../models/Following");

/**
 * Register a new user
 *
 */
router.post("/register", (req, res) => {
  if (!req.body || !req.body.name || !req.body.password) {
    // If both name and password are not given.
    return res
      .status(400)
      .json("Please provide both name and password to register.");
  }

  const { errors, isValid } = validateInput(req.body, "register");

  if (!isValid) {
    // Check Validation
    return res.status(400).json(errors);
  }

  User.findOne({ name: req.body.name }).then(user => {
    if (user) {
      // Username already exists.
      return res.status(400).json("Username already exists.");
    } else {
      // Create a new user.
      const newUser = new User({
        name: req.body.name,
        password: req.body.password
      });

      // Encrypt password.
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          newUser
            .save()
            .then(res.status(201).json("New user created."))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

/**
 * Login user.
 *
 */
router.post("/login", (req, res) => {
  // User is already logged in.
  if (req.session && req.session.name) {
    return res.status(400).json("Please logout first.");
  }

  if (!req.body || !req.body.name || !req.body.password) {
    // If both name and password are not given.
    return res
      .status(400)
      .json("Please provide both name and password to login.");
  }

  const { errors, isValid } = validateInput(req.body, "login");

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const name = req.body.name;
  const password = req.body.password;

  // Find user by name.
  User.findOne({ name }).then(user => {
    if (!user) {
      // User does not exist.
      errors.name = "User not found.";
      return res.status(404).json(errors);
    }

    // Check password.
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) {
        // Passwords do not match.
        errors.password = "Incorrect Password.";
        return res.status(400).json(errors);
      } else {
        // User matched.

        // Store name in session.
        req.session.name = name;

        return res.status(200).json("Logged in.");
      }
    });
  });
});

/**
 * Follow a user.
 *
 */
router.get("/:name/follow", (req, res) => {
  if (!req.session || !req.session.name) {
    // Check whether user is not logged in.
    return res.status(401).json("Please login first.");
  }

  const name = req.params.name;
  const requestUserName = req.session.name;

  if (name === requestUserName) {
    // Check if the user is trying to follow itself.
    return res.status(400).json("You cannot follow yourself.");
  }

  User.findOne({ name }).then(user => {
    if (!user) {
      // Check if the user exists or not.
      return res.status(400).json("User does not exist.");
    }

    User.findOne({ name: requestUserName }).then(requestUser => {
      const id = requestUser.id;
      Following.findOne({ user: id }).then(results => {
        if (!results) {
          // If user is not following anyone.
          const newFollowing = new Following({
            user: id
          });
          newFollowing.following.unshift({ user: user.id });
          newFollowing.save().then(res.json("You are now following " + name));
        } else {
          if (
            results.following.filter(
              follwingUser =>
                follwingUser.user.toString() === user.id.toString()
            ).length > 0
          ) {
            // If logged in user is already following this user.
            res.status(400).json("You are already following " + name);
          } else {
            results.following.unshift({ user: user.id });
            results.save().then(res.json("You are now following " + name));
          }
        }
      });
    });
  });
});

/**
 * Unfollow a user.
 *
 */
router.get("/:name/unfollow", (req, res) => {
  if (!req.session || !req.session.name) {
    // Check whether user is not logged in.
    return res.status(401).json("Please login first.");
  }

  const name = req.params.name;
  const requestUserName = req.session.name;

  if (name === requestUserName) {
    // Check if the user is trying to unfollow itself.
    return res.status(400).json("You cannot unfollow yourself.");
  }

  User.findOne({ name }).then(user => {
    if (!user) {
      // Check if the user exists or not.
      return res.status(400).json("User does not exist.");
    }

    User.findOne({ name: requestUserName }).then(requestUser => {
      const id = requestUser.id;
      Following.findOne({ user: id }).then(results => {
        if (!results) {
          // User is not following anyone.
          res.status(400).json("You are not following " + name);
        } else {
          if (
            results.following.filter(
              follwingUser =>
                follwingUser.user.toString() === user.id.toString()
            ).length > 0
          ) {
            // If logged in user is following this user.

            // Get remove Index.
            const removeIndex = results.following
              .map(item => item.user.toString())
              .indexOf(user.id);

            // Splice out of array.
            results.following.splice(removeIndex, 1);

            results
              .save()
              .then(res.status(200).json("You have unfollowed " + name));
          } else {
            res.status(400).json("You are not following " + name);
          }
        }
      });
    });
  });
});

module.exports = router;
