/* jshint node:true */

var Utils = {};

Utils.intersects = function(pos, obj, staticObj){

    if(obj.getRightBoundsFromPos(pos) <= staticObj.getLeftBounds()) {
        return false;
    }

    if(obj.getLeftBoundsFromPos(pos) >= staticObj.getRightBounds()) {
        return false;
    }

    if(obj.getBottomBoundsFromPos(pos) <= staticObj.getTopBounds()) {
        return false;
    }

    if(obj.getTopBoundsFromPos(pos) >= staticObj.getBottomBounds()) {
        return false;
    }

    return true;
};


module.exports = Utils;