// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    username: { type: String, unique: true, require: true},
    firstName: String,
    lastName: String,
    hash: String,
    admin: Boolean
}));
