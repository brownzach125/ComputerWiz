var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');

// Models
var User = require("models/user.model");

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    User.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    User.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    User.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err);

            if (user) {
                // username already exists
                deferred.reject('Username ' + userParam.username + ' is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var userData = _.omit(userParam, 'password');


        // add hashed password to user object
        userData.hash = bcrypt.hashSync(userParam.password, 10);
        var user = new User(userData);

        user.save(function(err) {
            if (err) deferred.reject(err);

            deferred.resolve();
        });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    User.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            User.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser(user);
                    }
                });
        } else {
            updateUser(user);
        }
    });

    function updateUser(user) {
        // fields to update
        user.firstName = userParam.firstName;
        user.lastName  = userParam.lastName;
        user.username  = userParam.username;

        // update password if it was entered
        if (userParam.password) {
            user.hash = bcrypt.hashSync(userParam.password, 10);
        }

        user.save(function(err) {
            if ( err ) deferred.reject(err);

            deferred.resolve();
        })
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    User.findById(_id, function(err,user) {
       if (err) deferred.reject(err);

        user.remove(function(err) {
            if (err ) deferred.reject(err);

            deferred.resolve();
        });

    });

    return deferred.promise;
}

// TODO add to schema
// TODO Make name unique
