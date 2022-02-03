const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
  },
});

// userSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });
//
userSchema.set("versionKey", false);
userSchema.set("toJSON", {
  virtuals: true,
});

module.exports = User = mongoose.model("users", userSchema);
