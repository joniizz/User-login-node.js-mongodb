const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true}},
    password: { type: String, required: true, index: { unique: true}},
    loginAttempts: { type: Number, required: true, default: 0 },
    isLocked: {type: Boolean, default: false},
    lockUntil: { type: Number, default: null }

});
const User = mongoose.model("User", schema);

module.exports = User;
