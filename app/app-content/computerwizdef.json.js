var computerwizdef = {
    "!name" : "computerwiz",
    "!define": {
        "point" : {
            "x": "number",
            "y": "number",
        }
    },
    "castFireBall" : {
        "!type" : "fn(direction: number, speed: number, radius: number)",
        "!doc"  : "Cast a fireball at your opponent",
    },
    "getPos" : {
        "!type" : "fn() -> point",
        "!doc"  : "Get you current position"
    }
};