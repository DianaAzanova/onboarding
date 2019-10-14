var game;
var player;
var gameWidth = 272;
var gameHeight = 192;
var globalMap;
var group;
var player_state;
var PLAYER_STATE = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
    WALKING_LEFT: 4,
    WALKING_RIGHT: 5,
    WALKING_UP: 6,
    WALKING_DOWN: 7
};

window.onload = function () {
    game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "");
    game.state.add('Boot', boot);
    game.state.add('Preload', preload);
    game.state.add('PlayGame', playGame);
    
    game.state.start("Boot");
}

var boot = function (game) {
};
boot.prototype = {
    preload: function () {
        this.game.load.image("loading", "assets/sprites/loading.png");
    },
    create: function () {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.renderer.renderSession.roundPixels = true; // blurring off
        this.game.state.start("Preload");
    }
}

var preload = function (game) {
};
preload.prototype = {
    preload: function () {
        var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        game.load.setPreloadSprite(loadingBar);
        
        // tileset
        game.load.image("tileset", "assets/environment/tileset.png");
        game.load.image("collisions", "assets/environment/collisions.png");
        game.load.tilemap("map", "assets/maps/map.json", null, Phaser.Tilemap.TILED_JSON);
        // atlas
        game.load.atlasJSONArray("chars", "assets/atlas/chars.png", "assets/atlas/chars.json");
    },
    create: function () {
        this.game.state.start('PlayGame');
    }

}

var playGame = function (game) {
};
playGame.prototype = {
    create: function () {
        this.createMap();
        this.createGroundLevel();
        this.createObjectLevel();
        this.createPlayer(8.5, 95);
        this.createForeground();

        this.bindKeys();
        this.createCamera();
    },
    createCamera: function () {
        game.camera.follow(player);
    },
    bindKeys: function () {
        this.wasd = {
            left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            up: game.input.keyboard.addKey(Phaser.Keyboard.UP)
        }
        game.input.keyboard.addKeyCapture(
            [
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.UP
            ]
        );
    },
    createMap: function () {
        globalMap = game.add.tilemap("map");
        globalMap.addTilesetImage("collisions");
        globalMap.addTilesetImage("tileset");
        group = game.add.group();
    },
    createForeground: function () {
        this.foreground = globalMap.createLayer('Foreground');
        this.foreground2 = globalMap.createLayer('Foreground2');
        this.foreground.resizeWorld();
        this.foreground2.resizeWorld();
    },
    createObjectLevel: function () {
        this.objectsLayer1 = globalMap.createLayer("Objects 1");
        this.objectsLayer2 = globalMap.createLayer("Objects 2");
        this.objectsLayer3 = globalMap.createLayer("Objects 3");
        this.objectsLayer1.resizeWorld();
        this.objectsLayer2.resizeWorld();
        this.objectsLayer3.resizeWorld();
    },
    createGroundLevel: function () {
        //tilemap
        this.layer_collisions = globalMap.createLayer("Collisions");
        this.layer = globalMap.createLayer("Tile Layer 1");

        // collisions
        globalMap.setCollision([11179, 11180]);

        this.layer.resizeWorld();
        this.layer_collisions.resizeWorld();
        this.layer_collisions.visible = false;
    },
    createPlayer: function (x, y) {
        var temp = new Player(game, x, y);
        game.add.existing(temp);
    },
    update: function () {
        // physics
        game.physics.arcade.collide(player, this.layer_collisions);
        this.movePlayer();
    },
    movePlayer: function () {
        var vel = 75;
        // capture input
        if (this.wasd.down.isDown) {
            player_state = PLAYER_STATE.WALKING_DOWN;
            player.body.velocity.y = vel;
            player.body.velocity.x = 0;
        } else if (this.wasd.up.isDown) {
            player_state = PLAYER_STATE.WALKING_UP;
            player.body.velocity.y = -vel;
            player.body.velocity.x = 0;
        } else if (this.wasd.left.isDown) {
            player_state = PLAYER_STATE.WALKING_LEFT;
            player.body.velocity.x = -vel;
            player.body.velocity.y = 0;
        } else if (this.wasd.right.isDown) {
            player_state = PLAYER_STATE.WALKING_RIGHT;
            player.body.velocity.x = vel;
            player.body.velocity.y = 0;
        } else {
            player.body.velocity.y = 0;
            player.body.velocity.x = 0;
        }

        // idle
        if (player_state == PLAYER_STATE.WALKING_DOWN && player.body.velocity.y == 0) {
            player_state = PLAYER_STATE.DOWN;
        } else if (player_state == PLAYER_STATE.WALKING_UP && player.body.velocity.y == 0) {
            player_state = PLAYER_STATE.UP;
        } else if (player_state == PLAYER_STATE.WALKING_LEFT && player.body.velocity.x == 0) {
            player_state = PLAYER_STATE.LEFT;
        } else if (player_state == PLAYER_STATE.WALKING_RIGHT && player.body.velocity.x == 0) {
            player_state = PLAYER_STATE.RIGHT;
        }

    },
}

// entities

// player

Player = function (game, x, y) {
    x *= 16;
    y *= 16;
    this.initX = x;
    this.initY = y;
    Phaser.Sprite.call(this, game, x, y, "chars", "idle/hero-idle-back/hero-idle-back");
    this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
    this.body.setSize(15, 15, 5, 21);
    //add animations
    var animVel = 6;
    this.animations.add('idle-front', ['idle/hero-idle-front/hero-idle-front'], 0, true);
    this.animations.add('idle-back', ['idle/hero-idle-back/hero-idle-back'], 0, true);
    this.animations.add('idle-side', ['idle/hero-idle-side/hero-idle-side'], 0, true);
    this.animations.add('walk-front', Phaser.Animation.generateFrameNames('walk/hero-walk-front/hero-walk-front-', 1, 4, '', 0), animVel, true);
    this.animations.add('walk-back', Phaser.Animation.generateFrameNames('walk/hero-walk-back/hero-walk-back-', 1, 4, '', 0), animVel, true);
    this.animations.add('walk-side', Phaser.Animation.generateFrameNames('walk/hero-walk-side/hero-walk-side-', 1, 4, '', 0), animVel, true);
    this.type = "player";
    player = this;

}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function () {
    // player walk animation
    if (player_state == PLAYER_STATE.WALKING_DOWN) {
        this.animations.play("walk-front");
        this.scale.x = 1;
    } else if (player_state == PLAYER_STATE.WALKING_UP) {
        this.animations.play("walk-back");
        this.scale.x = 1;
    } else if (player_state == PLAYER_STATE.WALKING_LEFT) {
        this.animations.play("walk-side");
        this.scale.x = -1;
    } else if (player_state == PLAYER_STATE.WALKING_RIGHT) {
        this.animations.play("walk-side");
        this.scale.x = 1;
    } else if (player_state == PLAYER_STATE.DOWN) {
        this.animations.play("idle-front");
        this.scale.x = 1;
    } else if (player_state == PLAYER_STATE.UP) {
        this.animations.play("idle-back");
        this.scale.x = 1;
    } else if (player_state == PLAYER_STATE.LEFT) {
        this.animations.play("idle-side");
    } else if (player_state == PLAYER_STATE.RIGHT) {
        this.animations.play("idle-side");
    }
}