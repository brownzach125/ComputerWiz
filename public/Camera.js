/* jshint browser:true */
/* global EMBED, DEBUG, redraw, TILE_LENGTH */


var CAMERA_NATIVE_WIDTH = 480;
var CAMERA_NATIVE_HEIGHT = 270;

var Camera = {};

Camera.canvas = null;
Camera.context = null;

Camera.scale = 0;
Camera.width = CAMERA_NATIVE_WIDTH * Camera.scale;
Camera.height = CAMERA_NATIVE_HEIGHT * Camera.scale;

Camera.init = function() {
    Camera.canvas = document.getElementById('gameCanvas');
    Camera.context = Camera.canvas.getContext('2d');

    Camera.canvas.width = Camera.width;
    Camera.canvas.height = Camera.height;

    Camera.bestFitCamera();
};

Camera.bestFitCamera = function() {
    var bestScaleW = 1;
    while(CAMERA_NATIVE_WIDTH * (bestScaleW+1) < window.innerWidth)
        bestScaleW++;

    var bestScaleH = 1;
    while(CAMERA_NATIVE_HEIGHT * (bestScaleH+1) < window.innerHeight)
        bestScaleH++;

    var bestScale = (bestScaleW < bestScaleH) ? bestScaleW : bestScaleH;

    Camera.setScale(bestScale);
};

Camera.positionCanvas = function() {
    var x = (window.innerWidth - Camera.width) / 2;
    var y = (window.innerHeight - Camera.height) / 2;

    if(y > 100)
        y = 100;

    if(EMBED)  {
        x = 0;
        y = 0;
    }

    Camera.canvas.style.left = x + "px";
    Camera.canvas.style.top = y + "px";
};

Camera.setScale = function(scale) {
    Camera.scale = scale;
    Camera.width = CAMERA_NATIVE_WIDTH * Camera.scale;
    Camera.height = CAMERA_NATIVE_HEIGHT * Camera.scale;

    Camera.canvas.width = Camera.width;
    Camera.canvas.height = Camera.height;

    Camera.positionCanvas();

    redraw();
};

Camera.clear = function() {

};

// Set by player
Camera.center = { x : 0 ,y: 0 };

Camera.drawImage = function(img, x, y, width, height, direction) {
    //draw canvas without smoothing
    Camera.context.imageSmoothingEnabled = false;
    Camera.context.mozImageSmoothingEnabled = false;
    Camera.context.oImageSmoothingEnabled = false;
    Camera.context.imageSmoothingEnabled = false;

    //draw the object in the right direction. seems harder than it should be
    if (direction){
        Camera.context.save();
        var imgWidth = width*Camera.scale;
        var imgHeight = height*Camera.scale;
        Camera.context.translate(x*Camera.scale + imgWidth/2, y*Camera.scale + imgHeight/2);        
        Camera.context.rotate(direction);
        Camera.context.translate(-imgWidth/2, -imgHeight/2);        
        Camera.context.drawImage(img, 0, 0, imgWidth, imgHeight);
        Camera.context.restore();
    }
    else {
        Camera.context.drawImage(img, x*Camera.scale, y*Camera.scale, width*Camera.scale, height*Camera.scale);
    }
};

Camera.drawImageSmooth = function(img, x, y, width, height) {
    Camera.context.imageSmoothingEnabled = true;
    Camera.context.mozImageSmoothingEnabled = true;
    Camera.context.oImageSmoothingEnabled = true;
    Camera.context.imageSmoothingEnabled = true;
    Camera.context.drawImage(img, x*Camera.scale, y*Camera.scale, width*Camera.scale, height*Camera.scale);
};

Camera.drawImageWorldPos = function(img , x , y , width , height) {
    Camera.context.imageSmoothingEnabled = false;
    Camera.context.mozImageSmoothingEnabled = false;
    Camera.context.oImageSmoothingEnabled = false;
    Camera.context.imageSmoothingEnabled = false;
    Camera.context.drawImage(img, (x - Camera.center.x)*Camera.scale, ( y - Camera.center.y )*Camera.scale, width*Camera.scale, height*Camera.scale);
};

Camera.drawImageSmoothWorldPos = function(img, x, y, width, height) {
    Camera.context.imageSmoothingEnabled = true;
    Camera.context.mozImageSmoothingEnabled = true;
    Camera.context.oImageSmoothingEnabled = true;
    Camera.context.imageSmoothingEnabled = true;
    Camera.context.drawImage(img, (x - Camera.center.x)*Camera.scale, ( y - Camera.center.y )*Camera.scale, width*Camera.scale, height*Camera.scale);
};

Camera.drawLine = function(color, x, y, dx, dy) {
    Camera.context.beginPath();
    Camera.context.moveTo(x*Camera.scale,y*Camera.scale);
    Camera.context.lineTo(dx*Camera.scale,dy*Camera.scale);
    Camera.context.strokeStyle= color;
    Camera.context.stroke();
};

Camera.drawLineWorldPos = function(color, x, y, dx, dy) {
    x -= Camera.center.x;
    y -= Camera.center.y;
    dx-= Camera.center.x;
    dy-= Camera.center.y;

    Camera.context.beginPath();
    Camera.context.moveTo(x*Camera.scale,y*Camera.scale);
    Camera.context.lineTo(dx*Camera.scale,dy*Camera.scale);
    Camera.context.strokeStyle= color;
    Camera.context.stroke();
};

Camera.getViewScreenInfo = function() {
    var info = {};
    info.rows = Math.floor(CAMERA_NATIVE_HEIGHT / TILE_LENGTH);
    info.cols = Math.floor(CAMERA_NATIVE_WIDTH  / TILE_LENGTH);
    info.startRow = Math.floor(Camera.center.y / TILE_LENGTH);
    info.startCol = Math.floor(Camera.center.x / TILE_LENGTH);
    return info;
};


