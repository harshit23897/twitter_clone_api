const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TweetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  tweet: {
    type: String,
    required: true,
    maxlength: 280
  }
});

module.exports = Tweet = mongoose.model("tweet", TweetSchema);
