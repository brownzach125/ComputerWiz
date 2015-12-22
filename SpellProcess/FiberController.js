var Fiber = require('fibers');

var FiberController = {};
FiberController.startFiber = function(funcName , input) {
    if ( this.fiber ) {
        console.log("Thre is already a fiber in execution");
        return;
    }
    this.fiber = new Fiber(funcName);
    this.fiber.run(input);
};

FiberController.resume = function() {
    if ( this.fiber ) {
        this.fiber.run();
    }
    else {
        console.log("FiberController resume called when fiber is null");
    }
};

FiberController.terminate = function() {
    console.log("Fiber Controller terminate");
    this.fiber = null;
    Fiber.yield();
};

FiberController.pause = function() {
    if ( !this.fiber ) {
        console.log("FiberController called when fiber is null");
        return;
    }
    Fiber.yield();
};

module.exports = FiberController;