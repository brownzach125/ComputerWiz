/**
 * Created by solevi on 8/16/16.
 */

var service = {};

port = 60600;
service.getPort = function() {
    return port++;
};

module.exports = service;