var util = require("util");

var SpriteList = function() {
    this.list = {};
    this.push = function(spr) {
        this.list[spr.id] = spr;
    };
    this.draw = function() {
        for (prop in this.list) {
            this.list[prop].draw();
        }
    };
}

var sprites = new SpriteList();
var activeSprites = new SpriteList();
var environmentSprites =  new SpriteList();

var Game = (function() {
    var keysDown = {};

    addEventListener("keydown", function(e) {
        keysDown[e.keyCode] = true;
        //console.log(e.keyCode);
    });

    addEventListener("keyup", function(e) {
        delete keysDown[e.keyCode];
    });

    var drawMap = function() {
        var startX = this.view.pos.x - (this.view.pos.x % this.Map.tileSize);
        var startY = this.view.pos.y - (this.view.pos.y % this.Map.tileSize);
        var img;

        for(var x = startX; x <= startX + this.view.width; x += this.Map.tileSize) {
            for (var y = startY; y <= startY + this.view.height; y+= this.Map.tileSize) {
                img = this.Map.getImageAt(0, {x: x, y: y});
                this.ctx.drawImage(img,
                                x - this.view.pos.x,
                                y - this.view.pos.y,
                                this.Map.tileSize,
                                this.Map.tileSize);

                img = this.Map.getImageAt(1, {x: x, y: y});
                this.ctx.drawImage(img,
                                x - this.view.pos.x,
                                y - this.view.pos.y,
                                this.Map.tileSize,
                                this.Map.tileSize);
            }
        }
    };

    var drawSprites = function() {
        activeSprites.draw();
    };

    return {
        canvas : undefined,
        ctx : undefined,
        view : {width : 0, height: 0, pos: {x:0, y:0}},
        sprites : sprites,
        init : function(Map, AssetManager) {
            // VERY IMPORTANT, BIND PRIVATE METHODS
            console.log(this)
            drawMap = drawMap.bind(this);
            drawSprites = drawSprites.bind(this);

            this.Map = Map;
            this.AssetManager;
            this.canvas = document.getElementById("survival");
            this.ctx = this.canvas.getContext("2d");

            this.FPS = 60;
            this.view = {
                width : this.canvas.width,
                height : this.canvas.height,
                pos : { x : 16, y : 28 },
            };

            this.player = (function() {
                var obj = {};

                BaseVisual.call(obj, true, 'player', {x: 300, y: 200}, 32, 32);

                var img = AssetManager.getImage('player');
                obj.speed = (1.0 / Game.FPS) * 200;
                obj.draw = function() {
                    Game.ctx.drawImage(img, obj.pos.x, obj.pos.y, obj.width, obj.height);
                };

                util.inherits(obj, BaseVisual);
                return obj;
            })();

            var borderThickness = Game.view.height / 4;
            var northPlayerCheck = new viewBorderDetector('NB',
                                                        {x: 0, y: 0},
                                                        Game.view.width,
                                                        borderThickness);

            var southPlayerCheck = new viewBorderDetector('SB',
                                                        {x: 0, y: Game.view.height-(borderThickness)},
                                                        Game.view.width,
                                                        borderThickness);

            var eastPlayerCheck = new viewBorderDetector('EB',
                                                        {x: Game.view.width - (borderThickness), y: 0},
                                                        borderThickness,
                                                        Game.view.height);

            var westPlayerCheck = new viewBorderDetector('WB',
                                                        {x: 0, y: 0},
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
            var spr;
            var collisions = [];
            for (prop in environmentSprites.list) {
                spr = environmentSprites.list[prop];

                if ((this.player.pos.x < (spr.pos.x + spr.width)) &&
                    ((this.player.pos.x + this.player.width) > spr.pos.x) &&
                    (this.player.pos.y < (spr.pos.y + spr.height)) &&
                    ((this.player.pos.y + this.player.height) > spr.pos.y))
                {
                    collisions.push({r1 : this.player, r2 : spr}) 
                }
            }
            return collisions;
        },
        collisionResolution : function(collisionData) {
            var colKey;
            var view = this.view;
            var Map = this.Map;
            var collisionResMap = {
                'playerNB' : function(collision) {
                    view.pos.y -= collision.r1.speed;
                    if (view.pos.y < 0) view.pos.y = 0;
                    else collision.r1.pos.y = collision.r2.height + 1;
                },
                'playerSB' : function(collision) {
                    view.pos.y += collision.r1.speed;
                    if ((view.pos.y + view.height) > Map.height) view.pos.y = (Map.height - view.height);
                    else collision.r1.pos.y = collision.r2.pos.y - collision.r1.height - 1;
                },
                'playerEB' : function(collision) {
                    view.pos.x += collision.r1.speed;
                    if ((view.pos.x + view.width) > Map.width) view.pos.x = (Map.width - view.width);
                    else collision.r1.pos.x = collision.r2.pos.x - collision.r1.width - 1;
                },
                'playerWB' : function(collision) {
                    view.pos.x -= collision.r1.speed;
                    if (view.pos.x < 0) view.pos.x = 0;
                    else collision.r1.pos.x = collision.r2.width + 1;
                }
            };
            collisionData.forEach(function(elm, ind, arr) {
                collisionResMap[elm.r1.sig + elm.r2.sig](elm);
            });
        },
        draw : function() {
            drawMap();
            drawSprites();
        }
        
    };
})();

var BaseVisual = function(activeFlag, sig, pos, width, height) {
    if (typeof BaseVisual.id == 'undefined') BaseVisual.id = 0;
    this.id = BaseVisual.id++;
    this.sig = sig;
    this.pos = pos;
    this.width = width;
    this.height = height;
    sprites.push(this);
    if (activeFlag) activeSprites.push(this);

};

var viewBorderDetector = function(sig, pos, width, height) {
    BaseVisual.call(this, true, sig, pos, width, height);
    environmentSprites.push(this);

    this.color = 'rgba(0, 0, 128, .3)';
    this.draw = function() {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    };
}
util.inherits(viewBorderDetector, BaseVisual);


module.exports = Game;
