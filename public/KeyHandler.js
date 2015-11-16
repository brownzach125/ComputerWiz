var KeyHandler = {};

KeyHandler.up = false;
KeyHandler.left = false;
KeyHandler.down = false;
KeyHandler.right = false;


KeyHandler.onKeyDown = function(event) {
    Socket.emit('keyDown' , event.keyCode);
    switch(event.keyCode) {
        // W, Up Arrow
        case 87:
        case 38: 	//KeyHandler.up = true;
            break;

        // A, Left Arrow
        case 65:
        case 37: 	//KeyHandler.left = true;
            break;
        // S, Down Arrow
        case 83:
        case 40: 	//KeyHandler.down = true;
            break;
        // D, Right Arrow
        case 68:
        case 39: 	//KeyHandler.right = true;
            break;
        //1
        case 49: 	//Camera.setScale(1);
            break;

        //2
        case 50: 	//Camera.setScale(2);
            break;

        //3
        case 51: 	//Camera.setScale(3);
            break;

        // 4
        case 52: 	//Camera.setScale(4);
            break;

        // Q
        case 81: 	{
            break;


        }

        // Space
        case 32:
            break;

        // Tilda Swinton baby
        case 192: 	DEBUG = !DEBUG;
            break;

        // Enter at our own risk
        case 13: {
            if (gameState == "menu") {
                startGame();
            }
            else if (gameState == "on") {
                PAUSE = !PAUSE;
                ToggleWordBlock(null , true);
            }
            else if (gameState == "over") {
                resetGame();
            }
            break;
        }
    }
};

KeyHandler.onKeyUp = function(event)  {
    Socket.emit('keyUp' , event.keyCode);
    switch(event.keyCode) {
        // W, Up Arrow
        case 87:
        case 38: 	KeyHandler.up = false;
            break;

        // A, Left Arrow
        case 65:
        case 37: 	KeyHandler.left = false;
            break;

        // S, Down Arrow
        case 83:
        case 40: 	KeyHandler.down = false;
            break;

        // D, Right Arrow
        case 68:
        case 39: 	KeyHandler.right = false;
            break;
    }
};