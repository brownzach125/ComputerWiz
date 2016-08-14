// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
mongoose.Promise = require("bluebird");
var Schema = mongoose.Schema;
var Q = require('q');
var User = require('./user.model');


var Spell = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    code: String,
    slot: Number,
    name: String,
});

Spell.statics.getByUserId = function(userId) {
    var deferred = Q.defer();
    this.find({userId:userId}, function(err, spells) {
        if (err) deferred.reject(err);

        deferred.resolve(spells);
    });
    return deferred.promise;
};

Spell.statics.getByUsername = function(username) {
    var deferred = Q.defer();
    var that = this;
    User.findOne({username:username} , function(err, user) {
        if (err) {
            deferred.reject(err);
            return;
        }
        if (!user) {
            deferred.reject(err);
            return;
        }

        that.find({userId:user._id}, function(err, spells) {
           if (err) deferred.reject(err);

           deferred.resolve(spells);
        });
    });
    return deferred.promise;
};

//Spell.statics.


// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Spell',Spell);
