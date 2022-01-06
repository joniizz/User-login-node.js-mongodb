const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//Initialize Mongoose
const db = {};
db.mongoose = mongoose;

db.user = require("./user.model");

module.exports = db;
