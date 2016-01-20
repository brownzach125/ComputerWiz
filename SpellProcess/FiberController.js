var Fiber = require('fibers');

function FiberController() {
    this.terminateOnNextResume = false;
    this.terminationCallback = null;
}

FiberController.prototype.startFiber = function(funcName , input) {
    if ( this.fiber ) {
        console.log("Thre is already a fiber in execution");
        return;
    }
    this.fiber = new Fiber(funcName);
    this.fiber.run(input);
};

FiberController.prototype.resume = function() {
    if ( this.terminateOnNextResume == true ) {
        this.fiber = null;
        this.terminateOnNextResume = false;
        this.terminationCallback();
        return;
    }

    if ( this.fiber ) {
        this.fiber.run();
    }
    else {
        console.log("FiberController resume called when fiber is null");
    }
};

// Calling terminate will cause the next call to resume to destroy the fiber and end execution
// then call the callback provider
FiberController.prototype.terminate = function(callback) {
    console.log("Fiber Controller terminate");
    if ( !this.fiber) {
        console.log("Fiber Controller terminate called on null fiber");
        return;
    }
    this.terminateOnNextResume = true;
    this.terminationCallback = callback;
    this.resume();

};

FiberController.prototype.pause = function() {
    if ( !this.fiber ) {
        console.log("FiberController called when fiber is null");
        return;
    }
    Fiber.yield();
};

module.exports = FiberController;