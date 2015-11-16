var ResourceManager = {};

ResourceManager.queue = [];

ResourceManager.isGameLoaded = function() {
    var length = ResourceManager.queue.length;
    if ( length == 0) {
        return true;
    }
    else {
        //console.log("Queue length is " + length);
        return false;
    }
};

ResourceManager.loadImage = function(path) {
    ResourceManager.queue.push(path);
    var img = document.createElement('img');
    img.src = path;

    img.onload = function () {
        ResourceManager.queue.pop();
        //console.log("image loaded");
        //console.log("queue length " + ResourceManager.queue.length);
        //Util.removeByValue(ResourceManager.queue, path);
    };

    return img;
};

ResourceManager.loadSound = function(path) {
    //ResourceManager.queue.push(path);

    var snd = document.createElement("audio");
    snd.src = path; // buffers automatically when created
    console.log("loading sound");

    snd.onload = function () {
        ResourceManager.queue.pop();
        console.log("sound loaded");

        //Util.removeByValue(ResourceManager.queue, path);
    };

    return snd;
};