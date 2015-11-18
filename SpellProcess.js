var vm = require('vm');
var Fiber = require('fibers');

var fiber = Fiber(castSpell);
var p = process;
location = {};
process.on('message' , function(data) {
    var type = data.type;
    // Message is telling me to start the spell execution
    if ( type == 'startSpell') {
        var code = data.code;
        fiber.run(code);
    }
    // Message is the response to some request
    if ( type == 'data') {
        location = data.value;
        fiber.run();
    }
});

function sendRequest(funcName , params) {
    var f = Fiber.current;
    process.send({
        type: 'request',
        funcName: funcName,
        params:  params
    });
    function waitForResponse() {
        fiber = Fiber.current;
        //while( !recieved) {
        //    setImmediate(function() {
        //        fiber.run();
        //    });
        Fiber.yield();
    }
    waitForResponse();
}

function BASIC() {
    this.getPOS = function() {
        sendRequest('getPos' , arguments);
        return location;
    };
    this.castFireBall = function() {
        sendRequest('castFireBall' , arguments);
        return location;
    }
}

var basic = new BASIC();
function castSpell(code) {
    var script = new vm.Script(code);
    var sandbox = {
        BASIC : basic,
    };
    var context = vm.createContext(sandbox);
    // Run the script
    try {
        script.runInContext( context );
    }
    catch (err) {
        console.log(err);
        process.send({type:'error' ,  err : err.message});
    }
    process.exit();
}
