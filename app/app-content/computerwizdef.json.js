var computerwizdef = {
    "!name": "computerwiz.js",
    "castFireBall": {
        "!type": "fn(direction: number, speed: number, radius: number)",
        "!doc": "Hurls a fireball\n@param {number} direction The direction to lob the fireball in. Angle in degrees with 0 degrees being to the right of the wizard\n@param {number} speed The rate at which the fireball travels min:0 max:10\n@param {number} radius Radius of the fireball. min:1 max:10\n"
    },
    "teleport": {
        "!type": "fn()",
        "!doc": "Teleport Self to New Location\n"
    },
    "hide": {
        "!type": "fn()",
        "!doc": "Hide away\n"
    },
    "sleep": {
        "!type": "fn(time: number)",
        "!doc": "Pauses the spell\n@param {number} time Amount of time to pause in milliseconds\n"
    }
};