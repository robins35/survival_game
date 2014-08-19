var AssetManager = require('./asset_manager');
var Map = require('./map');
var Game = require('./game_objs');

var requestAnimFrame = window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame  ||
                    window.mozRequestAnimationFrame     ||
                    window.oRequestAnimationFrame       ||
                    window.msRequestAnimationFrame      ||
                    null;

$(document).ready(function() {
    function doneLoadingAssets() {
        console.log("FINISHED LOADING ASSETS!");
    }

    AssetManager.loadAssets(function() {
        Map.init(AssetManager.imgs);
        Game.init(Map, AssetManager);

        var gameLoop = function() {
            Game.update();
            Game.draw();
        };

        if (requestAnimFrame) {
            console.log("Using a sane animation frame, good.");
            var recursiveAnim = function() {
                gameLoop();
                requestAnimFrame(recursiveAnim);
            };

            requestAnimFrame(recursiveAnim);
        }
        else {
            console.log("FALLING BACK TO setInterval, UPDATE YOUR BROWSER!!!");
            setInterval(gameLoop, 1000/Game.FPS);
        }
    });
});
