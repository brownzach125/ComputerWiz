/**
 * Created by solevi on 8/14/16.
 */
var SpellBook = require("../game-serverside/shared/SpellBook.js");
var fs = require("fs");

var def = {
    "!name": "computerwiz.js"

};

for ( var key in SpellBook) {
    var obj = SpellBook[key];

    var type = "fn(";
    var params = obj.params;
    if (params) {
        for ( var i =0; i < params.length; i++) {
            type+= params[i].name + ": " + params[i].type;
            if (i < params.length -1 )
                type +=", ";
        }
    }
    type += ")";

    var doc = obj.brief_description +"\n";
    if (params) {
        for (var i=0; i < params.length; i++) {
            var param = params[i];
            doc+= "@param {" + param.type +  "} " + param.name + " " + param.description + "\n";
        }
    }

    def[obj.name] ={};
    def[obj.name]["!type"] = type;
    def[obj.name]["!doc"]  = doc;
}

var output = "var computerwizdef = " + JSON.stringify(def, null, 4) + ";";

fs.writeFile("../../app/app-content/computerwizdef.json.js", output, function(err) {

});