var game;
var player;
var manager;
var gameWidth = 272;
var gameHeight = 192;
var globalMap;
var fragments;
var audioFlag = true;
var player_state;
var score = 0;
var scoreFragments;
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
        game.renderer.renderSession.roundPixels = true; // исключение неясных очертаний пикселей
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
        // тайлсеты
        game.load.image("tileset", "assets/environment/tileset.png");
        game.load.image("collisions", "assets/environment/collisions.png");
        game.load.tilemap("map", "assets/maps/map.json", null, Phaser.Tilemap.TILED_JSON);
        // атласы
        game.load.atlasJSONArray("chars", "assets/atlas/chars.png", "assets/atlas/chars.json");
		game.load.atlasJSONArray("manager", "assets/atlas/manager.png", "assets/atlas/manager.json");
		game.load.atlasJSONArray("doc", "assets/atlas/doc.png", "assets/atlas/doc.json");
		// экран приветствия
        game.load.image("title-bg", "assets/title/bg.png");
        game.load.image("title", "assets/title/xsolla.png");
        game.load.image("title-press-enter", "assets/title/enter.png");
		game.load.image("instructions", "assets/title/window.png");
		//диалоговое окно
		game.load.image("dialogbox", "assets/environment/dialog.png");
		game.load.image("manager-dialog", "assets/atlas/manager-dialog.png");
		game.load.image("doc-dialog", "assets/atlas/doc-dialog.png");
		game.load.image("closebutton", "assets/environment/close.png");
		game.load.image("over", "assets/environment/over.png");
		game.load.image("win", "assets/environment/win.png");
		//квест
		game.load.image("fragments", "assets/environment/fragments.png");
		// музыка
        game.load.audio("music", ["assets/audio/Oblio-8-BitDancer.mp3"]);
		//шрифт
		game.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
    },
    create: function () {
        this.startMusic();
		this.game.state.start("TitleScreen");
    },
	    startMusic: function () {
        if (!audioFlag) {
            return
        }
        this.music = game.add.audio("music");
        this.music.loop = true;
        this.music.play();
    },

}
var titleScreen = function (game) {
};
titleScreen.prototype = {
    create: function () {	
        background = game.add.image(0, 0, "title-bg");
        this.title = game.add.image(game.width -130, 80, "title");
        this.title.anchor.setTo(0.5, 1);
        var tween = game.add.tween(this.title);
        tween.to({y: 80 + 7}, 700, Phaser.Easing.Linear.In).yoyo(true).loop();
        tween.start();
        //
        this.pressEnter = game.add.image(game.width -130, game.height - 90, "title-press-enter");
        this.pressEnter.anchor.setTo(0.5);
        //
        var startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startKey.onDown.add(this.startGame, this);
        this.state = 1;
		game.time.events.loop(800, this.blinkText, this);
    },
    startGame: function () {
        if (this.state == 1) {
            this.state = 2;
            this.title2 = game.add.image(game.width-132, game.height -105, 'instructions');
            this.title2.anchor.setTo(0.5);
            this.title.destroy();
        } else {
            this.game.state.start('PlayGame');
        }
    },
    blinkText: function () {
        if (this.pressEnter.alpha) {
            this.pressEnter.alpha = 0;
        } else {
            this.pressEnter.alpha = 1;
        }
    }
}
//игра
var playGame = function (game) {
};
playGame.prototype = {
    create: function () {
        this.createMap();
        this.createGroundLevel();
        this.createObjectLevel();
        this.createPlayer(8.5, 95);
		this.createGroups();
		this.createManager(7, 92);
		this.createDoc(10, 11);
        this.createForeground();
        this.bindKeys();
        this.createCamera();
		this.generaterFragments();
		this.scoreFragments();
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
	createManager: function (x, y) {
        var temp = new Manager(game, x, y);
        game.add.existing(temp);
    }, 
	createDoc: function (x, y) {
        var temp = new Doc(game, x, y);
        game.add.existing(temp);
    },
	  update: function () {
        // физика
        game.physics.arcade.collide(player, this.layer_collisions);
        this.movePlayer();
		this.game.physics.arcade.collide(player,fragments, this.collectFragments, null, this);
    },
	  createGroups: function () {
	fragments = game.add.group();
    fragments.enableBody = true;
    },
	
generaterFragments: function() {

    fragments.physicsBodyType = Phaser.Physics.ARCADE;
	var fragment;
	fragment=fragments.create(96,1344,"fragments");
	fragment=fragments.create(208,1296,"fragments");
	fragment=fragments.create(192,1184,"fragments");
	fragment=fragments.create(48,1136,"fragments");
	fragment=fragments.create(64,832,"fragments");
	fragment=fragments.create(224,784,"fragments");
	fragment=fragments.create(224,976,"fragments");
	fragment=fragments.create(64,672,"fragments");
	fragment=fragments.create(32,528,"fragments");
	fragment=fragments.create(208,464,"fragments");
	fragment=fragments.create(176,80,"fragments");
	fragment=fragments.create(32,128,"fragments");
	fragment=fragments.create(144,304,"fragments");
	fragment=fragments.create(224,512,"fragments");
	fragments.visible=false;
    },
	collectFragments: function(player, fragments) {
    //обновление счетчика
    score++;
	scoreFragments.text = 'ahfuvtynjd: ' + score;
    fragments.kill();
	if (score == 14) {dialogbox = game.add.image(64, 51, "over");
		dialogbox.fixedToCamera = true;
		} ;
  },	
  scoreFragments: function() {  
	win = game.add.image(this.game.width-268, this.game.height - 188, "win");
	win.fixedToCamera = true;
    scoreFragments = game.add.bitmapText(this.game.width-265, this.game.height - 185, "font",'ahfuvtynjd: 0',12);
    scoreFragments.fixedToCamera = true;
	scoreFragments.tint = "0x000000";
	win.visible=false;
	scoreFragments.visible=false;
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

// manager
 Manager = function (game, x, y) {
    x *= 16;
    y *= 16;
    this.initX = x;
    this.initY = y;
    Phaser.Sprite.call(this, game, x, y, "manager", "front2");
    this.anchor.setTo(0.5);
	this.inputEnabled = true; 
	this.input.useHandCursor = true; //при наведении рука - курсор
	//добавление окна диалога
	this.events.onInputUp.add(down,this);
	function down(){
		managerdialog = game.add.sprite(16, 1510, "manager-dialog");
		dialogbox = game.add.image(0, 1552, "dialogbox");
		var content = [ "ghbdtn! ns yjdtymrbq? vtyz pjden Ekbz, z gjvjufE jcdjbnmcz\n yjdbxrfv. ctqxfc ntAt yeByj gjljqnb r hjvfye, e ytuj lkz\n ntAz tcnm pflfybt. jy yfCjlbncz yf nhtnmtv DnfBt.\n pfjlyj jcvjnhbimcz : ) elfxb!" ]; 
		dialogtext = game.add.bitmapText(10, 1563, "font",content,6);
		dialogtext.lineSpacing = -7;
		closebutton = game.add.button(10, 10, "closebutton");
		closebutton.fixedToCamera = true;
		managerdialog.fixedToCamera = true;
		dialogbox.fixedToCamera = true;
		dialogtext.fixedToCamera = true;
		managerdialog.cameraOffset.setTo(16, 99);
		dialogbox.cameraOffset.setTo(0, 146);
		dialogtext.cameraOffset.setTo(10, 155);
		closebutton.cameraOffset.setTo(254, 175);
		closebutton.onInputUp.addOnce(removeDialog,this);
		
	function removeDialog (){
		dialogbox.destroy();
		managerdialog.destroy();
		closebutton.destroy();
		dialogtext.destroy();
								}
					}
game.physics.arcade.enable(this);
this.body.setSize(15, 15, 5, 21);
									}
Manager.prototype = Object.create(Phaser.Sprite.prototype); 
Manager.prototype.constructor = Manager;

//doc
Doc = function (game, x, y) {
    x *= 16;
    y *= 16;
    this.initX = x;
    this.initY = y;
    Phaser.Sprite.call(this, game, x, y, "doc", "doc-front2");
    this.anchor.setTo(0.5);
	this.inputEnabled = true;
	this.input.useHandCursor = true; //при наведении рука - курсор
	//добавляю окно
 	this.events.onInputUp.add(down,this);
	function down(){
		docdialog = game.add.sprite(16, 1510, "doc-dialog");
		dialogbox = game.add.image(0, 1552, "dialogbox");
		var content = [ "ghbdtncndeE. z hjvfy,b e vtyz tcnm bcgsnfybt lkz ntAz. xnjAs\n gjgfcnm r yfv d rjvfyle ntAt ytjACjlbvj cjplfnm ghjuhfvve.\n lkz Dnjuj cjAthb 14 ahfuvtynjd rjlf b z jwtyE ndjb pyfybz." ]; 
		dialogtext = game.add.bitmapText(10, 1563,"font", content,6);
		dialogtext.lineSpacing = -7;
		closebutton = game.add.button(10, 10, "closebutton");
		dialogtext.fixedToCamera = true;
		dialogbox.fixedToCamera = true;
		docdialog.fixedToCamera = true;
		closebutton.fixedToCamera = true;
		docdialog.cameraOffset.setTo(16, 99);
		dialogbox.cameraOffset.setTo(0, 146);
		dialogtext.cameraOffset.setTo(10, 157);
		closebutton.cameraOffset.setTo(254, 175);
		closebutton.onInputUp.addOnce(removeDialog,this);
		function removeDialog (){
			dialogbox.destroy();
			docdialog.destroy();
			closebutton.destroy();
			dialogtext.destroy();//закрыть окно
		fragments.visible=true;
		win.visible=true;
		scoreFragments.visible=true;
		}
	}
    game.physics.arcade.enable(this);
this.body.setSize(15, 15, 5, 21);
}
Doc.prototype = Object.create(Phaser.Sprite.prototype); 
