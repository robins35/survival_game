var util = require("util");

var SpriteList = function() {
    this.list = {};
    this.push = function(spr) {
        this.list[spr.id] = spr;
        console.log(this.list);
    };
    this.draw = function() {
        for (prop in this.list) {
            this.list[prop].draw();
        }
    };
}

var sprites = new SpriteList();
var activeSprites = new SpriteList();

var Game = (function() {
    var keysDown = {};

    addEventListener("keydown", function(e) {
        keysDown[e.keyCode] = true;
        console.log(e.keyCode);
    });

    addEventListener("keyup", function(e) {
        delete keysDown[e.keyCode];
    });

    return {
        canvas : undefined,
        ctx : undefined,
        view : {},
        sprites : sprites,
        init : function(Map, AssetManager) {
            this.Map = Map;
            this.AssetManager;
            this.canvas = document.getElementById("survival");
            this.ctx = this.canvas.getContext("2d");

            this.FPS = 60;
            this.view = {
                width : this.canvas.width,
                height : this.canvas.height,
                pos : { x : 16, y : 28 },
                updatePos : function(playerPos) {
                }
            };

            this.player = (function() {
                var obj = {};

                BaseVisual.call(obj, true, {x: 0, y: 0}, 32, 32);

                var img = AssetManager.getImage('player');
                obj.speed = (1.0 / Game.FPS) * 200;
                obj.draw = function() {
                    Game.ctx.drawImage(img, obj.pos.x, obj.pos.y, obj.width, obj.height);
                };

                util.inherits(obj, BaseVisual);
                return obj;
            })();

            var borderThickness = Game.view.height / 4;
            var northPlayerCheck = new viewBorderDetector({x: 0, y: 0},
                                                        Game.view.width,
                                                        borderThickness);

            var southPlayerCheck = new viewBorderDetector({x: 0, y: Game.view.height-(borderThickness)},
                                                        Game.view.width,
                                                        borderThickness);

            var eastPlayerCheck = new viewBorderDetector({x: Game.view.width - (borderThickness), y: 0},
                                                        borderThickness,
                                                        Game.view.height);

            var westPlayerCheck = new viewBorderDetector({x: 0, y: 0},
                                                        borderThickness,
                                                        Game.view.height);
        },
        update : function() {
            if(68 in keysDown && (this.player.pos.x + this.player.height) < this.view.width)
                this.player.pos.x += this.player.speed;
            if(65 in keysDown && this.player.pos.x > 0)
                this.player.pos.x -= this.player.speed;
            if(83 in keysDown && (this.player.pos.y + this.player.width) < this.view.height)
                this.player.pos.y += this.player.speed;
            if(87 in keysDown && this.player.pos.y > 0)
                this.player.pos.y -= this.player.speed;

            var collisionData = this.collisionDetection();
            this.collisionResolution(collisionData);
        },
        collisionDetection : function() {
            
        },
        collisionResolution : function(collisionData) {
            
        },
        drawMap : function() {
            var startX = this.view.pos.x - (this.view.pos.x % this.Map.tileSize);
            var startY = this.view.pos.y - (this.view.pos.y % this.Map.tileSize);
            var img;

            for(var x = startX; x <= startX + this.view.width; x += this.Map.tileSize) {
                for (var y = startY; y <= startY + this.view.height; y+= this.Map.tileSize) {
                    img = this.Map.getImageAt({x: x, y: y});
                    //console.log("PRINTING AT (" + x + "," + y + ")");
                    this.ctx.drawImage(img,
                                    x - this.view.pos.x,
                                    y - this.view.pos.y,
                                    this.Map.tileSize,
                                    this.Map.tileSize);
                }
            }
        },
        drawSprites : function() {
            activeSprites.draw();
        }
    };
})();

var BaseVisual = function(activeFlag, pos, width, height) {
    if (typeof BaseVisual.id == 'undefined') BaseVisual.id = 0;
    this.id = BaseVisual.id++;
    console.log("MAKING A NEW OBJECT WITH ID: " + this.id)
    this.pos = pos;
    this.width = width;
    this.height = height;
    sprites.push(this);
    if (activeFlag) activeSprites.push(this);

};

var viewBorderDetector = function(pos, width, height) {
    BaseVisual.call(this, true, pos, width, height);

    this.color = 'rgba(0, 0, 128, .3)';
    this.draw = function() {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    };
}
util.inherits(viewBorderDetector, BaseVisual);


module.exports = Game;
