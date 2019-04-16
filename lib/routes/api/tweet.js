const express = require("express");
const router = express.Router();

const Tweet = require("../../models/Tweet");

/**
 * Create tweet.
 *
 */
router.post("/", (req, res) => {
  if (!req.session || !req.session.name) {
    // Check whether user is not logged in.
    return res.status(401).json("Please login first.");
  }

  if (!req.body || !req.body.tweet) {
    // Check if the user has provided tweet in the request.
    return res.status(400).json("Please provide tweet.");
  }

  const name = req.session.name;
  const tweet = req.body.tweet;

  if (tweet.length > 280) {
    // Tweet length is greater than permissible.
    return res
      .status(400)
      .json("Tweet length cannot be more than 280 characters.");
  }

  User.findOne({ name }).then(user => {
    Tweet({
      user: user.id,
      tweet: tweet
    })
      .save()
      .then(result =>
        res.status(200).json("Your tweet is created with id " + result.id)
      );
  });
});

/**
 * Get tweet by id.
 *
 */
router.get("/:id", (req, res) => {
  if (!req.session || !req.session.name) {
    // Check whether user is not logged in.
    return res.status(401).json("Please login first.");
  }

  const tweetId = req.params.id;

  Tweet.findById(tweetId).then(tweet => {
    if (tweet) {
      return res.status(200).json(tweet.tweet);
    } else {
      return res.status(400).json("There is no tweet with tweet id " + tweetId);
    }
  });
});

/**
 * Delete tweet by id.
 *
 */
router.delete("/:id", (req, res) => {
  if (!req.session || !req.session.name) {
    // Check whether user is not logged in.
    return res.status(401).json("Please login first.");
  }

  const name = req.session.name;
  const tweetId = req.params.id;

  User.findOne({ name }).then(user => {
    if (!user) {
      return res.status(400).json("User doesn't exist.");
    }
    Tweet.findById(tweetId).then(tweet => {
      if (tweet && user.id.toString() === tweet.user.toString()) {
        // If tweet with this tweetid exists and current logged in user is the creater of that tweet.
        tweet.remove().then(res.status(200).json("Tweet successfully removed"));
      } else if (tweet) {
        // If tweet with this tweetid exists but the current logged in user is not the creater of that tweet.
        return res
          .status(400)
          .json("You don't have permission to delete this tweet.");
      } else {
        // If tweet with this tweetid does not exist.
        return res
          .status(400)
          .json("There is no tweet with tweet id " + tweetId);
      }
    });
  });
});

module.exports = router;
