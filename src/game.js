var game,
player,
gameWidth = 1088,
gameHeight = 640,
globalMap,
hero,
heroine,
npc,
npc_db,
id_npc,
content,
player_state,
PLAYER_STATE = {
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
    game.state.add('TitleScreen', titleScreen);
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
        // load title screen
        game.load.image("title-bg", "assets/title/bg.png");
        game.load.image("logo", "assets/title/logo.png");
        game.load.image("title-press-enter", "assets/title/press.png");
		game.load.image("instructions", "assets/title/control.png");
		game.load.image("select-pers", "assets/title/select-pers.png");
        // tileset
        game.load.image("tileset", "assets/environment/tileset.png");
        game.load.image("collisions", "assets/environment/collisions.png");
        game.load.tilemap("map", "assets/maps/map.json", null, Phaser.Tilemap.TILED_JSON);
        // atlas
        game.load.atlasJSONArray("personages", "assets/atlas/chars.png", "assets/atlas/chars.json");
		game.load.atlasJSONArray("glow", "assets/atlas/glow_NPC.png", "assets/atlas/glow_NPC.json");
		game.load.image("glowHR", "assets/atlas/glow_HR.png");
		// json
		game.load.json('npc', 'NPC.json');
		game.load.json('dialogues', 'dialogues.json');
		//font
		game.load.bitmapFont('pixel_font', 'assets/fonts/pixel_font.png', 'assets/fonts/pixel_font.xml');
		//elements
		game.load.image('dialogframe', 'assets/sprites/dialog.png');
		game.load.image("nextbutton", "assets/sprites/next.png");
		game.load.image("okbutton", "assets/sprites/ok.png");
    },
    create: function () {
        this.game.state.start("TitleScreen");
    }

}
var titleScreen = function (game) {
};
titleScreen.prototype = {
    create: function () {	
        background = game.add.image(0, 0, "title-bg");
        this.title = game.add.image(game.width-544,200, "logo");
        this.title.anchor.setTo(0.5);
		this.title.alpha = 0;
		var tween = game.add.tween(this.title).to( { alpha: 1 }, 4000, "Linear", true);
		tween.start();
        //
        this.pressEnter = game.add.image(game.width -544, 320, "title-press-enter");
        this.pressEnter.anchor.setTo(0.5);
        //
        var startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startKey.onDown.add(this.instructionsGame, this);
        this.state = 1;
		game.time.events.loop(500, this.blinkText, this);
    },
	 instructionsGame: function () {
        if (this.state == 1) {
            this.state = 2;
            this.title2 = game.add.image(game.width-544, 230, 'instructions');
			this.title2.anchor.setTo(0.5);
			var startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			startKey.onDown.add(this.selectpersGame, this);
			}
    },
	
	selectpersGame: function(hero, heroine){
			this.selectpers = game.add.image(game.width-544, 230, 'select-pers');
			this.selectpers.anchor.setTo(0.5);
			hero = game.add.image(440, 190, 'personages','hero-idle-front');
			hero.inputEnabled = true;
			heroine = game.add.image(560, 190, 'personages','heroine-idle-front');
			heroine.inputEnabled = true;
			const getSetAlphaCallback = (character, alpha) => () => {
				character.alpha = alpha;
			}
			[hero, heroine].forEach((character) => {
				character.events.onInputOver.add(getSetAlphaCallback(character, alpha = 0.5),this)
				character.events.onInputOut.add(getSetAlphaCallback(character, alpha = 1),this)
			},
			)
			hero.events.onInputUp.add(selectHero, this);
			heroine.events.onInputUp.add(selectHeroine, this);
			
			function selectHero()
			{
			atlas = "personages";
			startframe = "hero-idle-back";
			playerIdleFront = "hero-idle-front";
			playerIdleBack = "hero-idle-back";
			playerIdleRight = "hero-idle-side";
			playerWalkFront = "hero-walk-front-";
			playerWalkBack = "hero-walk-back-";
			playerWalkRight = "hero-walk-side-";
			this.game.state.start('PlayGame');
			}
			function selectHeroine()
			{
			atlas = "personages";
			startframe = "heroine-idle-back";
			playerIdleFront = "heroine-idle-front";
			playerIdleBack = "heroine-idle-back";
			playerIdleRight = "heroine-idle-side";
			playerWalkFront = "heroine-walk-front-";
			playerWalkBack = "heroine-walk-back-";
			playerWalkRight = "heroine-walk-side-";
			this.game.state.start('PlayGame');
			}
			this.title.destroy();
	},
	    blinkText: function () {
        if (this.pressEnter.alpha) {
            this.pressEnter.alpha = 0;
        } else {
            this.pressEnter.alpha = 1;
        }
    }
}

var playGame = function (game) {
};
playGame.prototype = {
    create: function () {
        this.createMap();
        this.createGroundLevel();
        this.createObjectLevel();
		this.createNpc();
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
    },
    createForeground: function () {
        this.foreground = globalMap.createLayer('Objects 3');
        this.foreground2 = globalMap.createLayer('Objects 4');
        this.foreground.resizeWorld();
        this.foreground2.resizeWorld();
    },
    createObjectLevel: function () {
        this.objectsLayer1 = globalMap.createLayer("Objects 1");
		this.objectsLayer2 = globalMap.createLayer("Objects 2");
        this.objectsLayer1.resizeWorld();
		this.objectsLayer2.resizeWorld();
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
	createNpc: function (position_x, position_y){
		npc_db = game.cache.getJSON('npc');
		for ( id_npc = 1; id_npc < 5; id_npc++ ){
		var temp = new NPC (game, id_npc, position_x, position_y, atlas, startframe);
		game.add.existing(temp);}
	},
    createPlayer: function (x, y) {
        var temp = new Player(game, x, y, atlas, startframe);
        game.add.existing(temp);
    },
	
    update: function () {
        // physics
        game.physics.arcade.collide(player, this.layer_collisions);
		game.physics.arcade.collide(player, npc);
        this.movePlayer();
    },

    movePlayer: function () {
        var vel = 600;
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

Player = function (game, x, y, atlas, startframe) {
    x *= 64;
    y *= 64;
    this.initX = x;
    this.initY = y;
    Phaser.Sprite.call(this, game, x, y, atlas, startframe);
    this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
    this.body.setSize(60,64,20,80);
    //add animations
    var animVel = 4;
    this.animations.add('idle-front', [playerIdleFront], 0, true);
    this.animations.add('idle-back', [playerIdleBack], 0, true);
    this.animations.add('idle-side', [playerIdleRight], 0, true);
    this.animations.add('walk-front', Phaser.Animation.generateFrameNames(playerWalkFront, 1, 4, '', 0), animVel, true);
    this.animations.add('walk-back', Phaser.Animation.generateFrameNames(playerWalkBack, 1, 4, '', 0), animVel, true);
    this.animations.add('walk-side', Phaser.Animation.generateFrameNames(playerWalkRight, 1, 4, '', 0), animVel, true);
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


NPC = function (game, id_npc, position_x, position_y, atlas, startframe)
{
	var position_x = npc_db[id_npc].position_x;
	var position_y = npc_db[id_npc].position_y;
	position_x *= 64;
    position_y *= 64;
	/* this.initX = position_x;
    this.initY = position_y; */
	var atlas = npc_db[id_npc].atlas;
	var startframe = npc_db[id_npc].startFrame;
	var name = npc_db[id_npc].name;
	Phaser.Sprite.call(this, game, position_x, position_y, atlas, startframe);
	this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
	this.body.immovable = true;
    this.body.setSize(60,64,20,30);
	this.type = "npc" + name;
	this.inputEnabled = true;
	this.input.useHandCursor = true;
    npc = this;
	
	if (this.type == "npc-HR") {this.events.onInputUp.add(HR,this);}
	
	this.events.onInputOver.add(glow,this);
	this.events.onInputOut.add(glow_remove,this);
	
	function glow ()
	{
		if (this.type == "npc-HR") {this.addChild(game.add.sprite(-52, -56, "glow", "HR"));}
		if (this.type == "npc-sasha") {this.addChild(game.add.sprite(-52, -60, "glow", "sasha"));}
		if (this.type == "npc-artem") {this.addChild(game.add.sprite(-52, -60, "glow", "artem"));}
		if (this.type == "npc-hostess") {this.addChild(game.add.sprite(-52, -60, "glow", "hostess"));}
		
	}
	function glow_remove ()
	{
		this.removeChildren();
	}
	
}
NPC.prototype = Object.create(Phaser.Sprite.prototype);
NPC.prototype.constructor = NPC;

var i = 1;
var HR = function (){

	content = game.cache.getJSON('dialogues'); 
	dialogframe = game.add.image(0, gameHeight, "dialogframe");
		dialogframe.fixedToCamera = true;
		dialogframe.cameraOffset.setTo(0, 448);
	point1();
	
	function point1 ()
	{
	dialogtext = game.add.bitmapText(10, gameHeight,"pixel_font", content.point_1[i], 24);
			dialogtext.lineSpacing = -7;
			dialogtext.fixedToCamera = true;
			dialogtext.cameraOffset.setTo(50, 490);
	nextbutton = game.add.button(108, 36, "nextbutton");
			nextbutton.fixedToCamera = true;
			nextbutton.cameraOffset.setTo(931, 560);
			nextbutton.onInputUp.addOnce(updateText, this);
	if (i == 3) {dialogtext.fontSize = 19;}
	if (i == 5) {
		nextbutton.destroy();
		nextbutton = game.add.button(108, 36, "okbutton");
		nextbutton.fixedToCamera = true;
		nextbutton.cameraOffset.setTo(975, 560);
		nextbutton.onInputUp.addOnce(updateText, this);
					}
	if (i == 6) {
		dialogframe.destroy();
		dialogtext.destroy();
		nextbutton.destroy();
		globalMap.removeTile(7, 88, "Collisions");
		globalMap.removeTile(8, 88, "Collisions");
		globalMap.removeTile(9, 88, "Collisions");
		i = 1;
					}
	function updateText ()
	{
		dialogtext.destroy();
		nextbutton.destroy();
		i++;
		point1();
	}
		}	
}
