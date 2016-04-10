/* jshint node:true */

var Utils = {};

Utils.intersects = function(pos, intersectable, staticIntersectable){

    if(intersectable.getRightBoundsFromPos(pos) <= staticIntersectable.getLeftBounds()) {
        return false;
    }

    if(intersectable.getLeftBoundsFromPos(pos) >= staticIntersectable.getRightBounds()) {
        return false;
    }

    if(intersectable.getBottomBoundsFromPos(pos) <= staticIntersectable.getTopBounds()) {
        return false;
    }

    if(intersectable.getTopBoundsFromPos(pos) >= staticIntersectable.getBottomBounds()) {
        return false;
    }

    return true;
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports = Utils;
}