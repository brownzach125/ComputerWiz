var Arena = {};
Arena.img = ResourceManager.loadImage('./art/Arena.png');
Arena.init = function() {
};
Arena.draw = function() {
    Camera.drawImage(this.img , 0 , 0 , CAMERA_NATIVE_WIDTH , CAMERA_NATIVE_HEIGHT);
};