var successCount = 0;
var errorCount = 0;
var imgs = {};
var imgPaths = [
    "images/grass.png",
    "images/dirt.gif",
    "images/water.gif",
    "images/mushroom.gif",
    "images/tree.png",
    "images/player.png"
];

var isDone = function() {
    return (imgPaths.length == (successCount + errorCount));
}

var loadImages = function(downloadCallback) {
    if (imgPaths.length == 0) downloadCallback();
    for (var i = 0; i < imgPaths.length; i++) {
        (function(src) {
            var name = src.split('/').slice(-1)[0].split('.')[0];
            imgs[name] = new Image();

            imgs[name].addEventListener("load", function() {
                successCount++;
                if (isDone()) downloadCallback();
            }, false);

            imgs[name].addEventListener("error", function() {
                errorCount++;
                if (isDone()) downloadCallback();
            }, false);

            imgs[name].src = src;
        })(imgPaths[i]);
    }
}

var loadAudio = function(downloadCallback) {
    if(imgPaths.length == 0) downloadCallback();
}

var loadAssets = function(downloadCallback) {
    loadImages(downloadCallback);
}

var getImage = function(name) {
    return imgs[name];
}

var getAudio = function(name) {
    return snds[name];
}

module.exports = {
    loadAssets : loadAssets,
    getImage : getImage,
    getAudio : getAudio,
    imgs : imgs
};
