var vm = require('vm');
var Fiber = require('fibers');

var fiber;// = Fiber(castSpell);
var p = process;
location = {};

var spells = {};
var needToEnd = false;
process.on('message' , function(data) {
    var type = data.type;
    // Message is telling me to start the spell execution
    if ( type == 'startSpell') {
        needToEnd = false;
        var slot = data.slot;
        fiber = new Fiber(castSpell);
        fiber.run(slot);
    }
    if ( type == 'createSpell') {
        var code = data.code;
        var slot = data.slot;
        try {
            var script = new vm.Script(code);
            var sandbox = {
                BASIC: basic
            };
            var context = vm.createContext(sandbox);
            spells[slot] = {
                script: new vm.Script(code),
                code: code,
                context: context
            };
        }
        catch(err ) {
            process.send({type: 'err' , err : err , when: 'createSpell'});
        }
    }
    // Message is the response to some request
    if ( type == 'data') {
        location = data.value;
        fiber.run();
    }
    if ( type =='die') {
        // Its time for this to end
        process.exit();
    }
    if (type == 'end') {
        // Set flag so spell will end next time a baisc funciton is called
        needToEnd = true;
    }
});


function sendRequest(funcName , params) {
    if ( needToEnd ) {
        // We need to stop!!
        process.send({type: 'done'});
        Fiber.yield();
        return;
    }
    var f = Fiber.current;
    process.send({
        type: 'request',
        funcName: funcName,
        params:  params
    });
    function waitForResponse() {
        fiber = Fiber.current;
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
function castSpell(slot) {
    // Run the script
    try {
        spells[slot].script.runInContext ( spells[slot].context);
        process.send({type :'done'});
    }
    catch (err) {
        console.log(err);
        process.send({type:'error' ,  err : err.message});
    }
}
