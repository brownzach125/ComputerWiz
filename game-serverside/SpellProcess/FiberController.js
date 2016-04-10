var Fiber = require('fibers');

function FiberController(funcName) {
    this.fiberIsRunning = false;
    var that = this;
    this.fiber = new Fiber(function(input) {
	    funcName(input);
        that.fiberIsRunning = false;
    });
}

FiberController.prototype.log = function(message){
    console.log("Fiber Controller: " + message);
};

FiberController.prototype.startFiber = function(input) {
    if ( this.fiberIsRunning ) {
        this.log("The fiber is already running, can\'t start new one");
        return;
    }
    this.fiberIsRunning = true;
    this.fiber.run(input);
};

FiberController.prototype.resume = function() {
    if ( this.fiberIsRunning ) {
        this.fiber.run()
    }
};

// Calling terminate will cause the next call to resume to destroy the fiber and end execution
// then call the callback provider
FiberController.prototype.terminate = function() {
    this.fiberIsRunning = false;
    this.fiber.reset();
};

FiberController.prototype.pause = function() {
    if ( !this.fiber ) {
        this.log("pause called when fiber is null");
        return;
    }
    if ( !this.fiberIsRunning) {
        this.log("pause called when the fiber is not running how?")
        return;
    }
    Fiber.yield();
};

module.exports = FiberController;
