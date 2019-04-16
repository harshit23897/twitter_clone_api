const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FollowingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ]
});

module.exports = Following = mongoose.model("following", FollowingSchema);
