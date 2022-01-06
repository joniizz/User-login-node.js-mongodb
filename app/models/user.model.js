const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true}},
    password: { type: String, required: true, index: { unique: true}},
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }

});
const User = mongoose.model("User", schema);

module.exports = User;
