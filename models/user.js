const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    // lname: {
    //     type: String,
    //     required: true,
    // },
    email: {
        type: String,
        required: true,
    },
    // role: {
    //     type: String,
    //     required: true,
    // },
    password: {
        type: String,
        required: true,
    },

});

// userSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });
//
userSchema.set("versionKey", false);
userSchema.set('toJSON', {
    virtuals: true,

});
//
// exports.User = mongoose.model('users', userSchema);
// exports.userSchema = userSchema;

module.exports = User = mongoose.model("users", userSchema);
