var AssetManager = require('./asset_manager');
var Map = require('./map');
var Game = require('./game_objs');

$(document).ready(function() {
    function doneLoadingAssets() {
        console.log("FINISHED LOADING ASSETS!");
    }

    AssetManager.loadAssets(function() {
        Map.init(AssetManager.imgs);
        Game.init(Map, AssetManager);

        setInterval(function() {
            Game.update();
            Game.drawMap();
            Game.drawSprites();
        }, 1000/Game.FPS);
    });
});
