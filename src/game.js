var playGame = function (game) {};
playGame.prototype = {
    create: function () {
        this.createMap();
        this.createGroundLevel();
        this.createObjectLevel();
        this.createNpc();
        this.createPlayer(8.5, 95);
        this.createForeground();
        this.createInventory();
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
            ]);
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
		game.physics.startSystem(Phaser.Physics.ARCADE);
    },
    createNpc: function (position_x, position_y) {
        npc_db = game.cache.getJSON('npc');
        for (id_npc = 1; id_npc < 5; id_npc++) {
            var temp = new NPC(game, id_npc, position_x, position_y, atlas, startframe);
            game.add.existing(temp);
        }
    },
    createInventory: function () {
        chewbacca = game.add.image(704, 4228, "chewbacca");
        chewbacca.inputEnabled = true;
        chewbacca.input.useHandCursor = true;
		
		welcomePack = game.add.physicsGroup();
		game.add.sprite(224, 664, 'pen', 0, welcomePack).events.onKilled.add(checkmark, this);
		game.add.sprite(388, 5436, 'notepad', 0, welcomePack).events.onKilled.add(checkmark, this);
		game.add.sprite(921, 2710, 'pack', 0, welcomePack).events.onKilled.add(checkmark, this);
		game.add.sprite(377, 5953, 'cup', 0, welcomePack).events.onKilled.add(checkmark, this);
		game.add.sprite(880, 1564, 'pillow', 0, welcomePack).events.onKilled.add(checkmark, this);
		welcomePack.setAll("body.enable", false);
		
        BookGlowGroup = game.add.group();
        game.add.sprite(108, 3224, 'book_glow', 0, BookGlowGroup).events.onInputUp.add(selectBook, this, 0, 'thealliance', 293);
        game.add.sprite(316, 3224, 'book_glow', 0, BookGlowGroup).events.onInputUp.add(selectBook, this, 0, 'vremyaigr', 285);
        game.add.sprite(316, 3272, 'book_glow', 0, BookGlowGroup).events.onInputUp.add(selectBook, this, 0, 'igravcifri', 293);
        game.add.sprite(160, 3272, 'book_glow', 0, BookGlowGroup).events.onInputUp.add(selectBook, this, 0, 'book', 285);
        game.add.sprite(196, 3240, 'book_glow', 0, BookGlowGroup).events.onInputUp.add(selectBook, this, 0, 'book2', 285);
        game.add.sprite(232, 3272, 'book_glow', 0, BookGlowGroup).events.onInputUp.add(selectBook, this, 0, 'book', 285);
        game.add.sprite(248, 3212, 'book_glow4', 0, BookGlowGroup).events.onInputUp.add(selectBook, this, 0, 'book2', 285);
        game.add.sprite(88, 3256, 'book_glow5', 0, BookGlowGroup).events.onInputUp.add(selectBook, this, 0, 'book', 285);
        game.add.sprite(148, 3224, 'book_glow6', 0, BookGlowGroup).events.onInputUp.add(selectBook, this, 0, 'book2', 285);

        BookGlowGroup.setAll("inputEnabled", true);
        BookGlowGroup.setAll("input.useHandCursor", true);
        BookGlowGroup.setAll("alpha", 0);
        //BookGlowGroup.onChildInputUp.add(selectBook, this, 0,);
		
		const getSetAlphaCallback = (character, alpha) => () => {
            character.alpha = alpha;
        }
        BookGlowGroup.forEach((character) => {
            character.events.onInputOver.add(getSetAlphaCallback(character, alpha = 1), this)
            character.events.onInputOut.add(getSetAlphaCallback(character, alpha = 0), this)
        }, );
    },
	
    createPlayer: function (x, y) {
        var temp = new Player(game, x, y, atlas, startframe);
        game.add.existing(temp);
    },

    update: function () {
        game.physics.arcade.collide(player, this.layer_collisions);
        game.physics.arcade.collide(npc_HR, player);
        game.physics.arcade.collide(player, npc_sasha);
        game.physics.arcade.collide(player, npc_ecologist);
        game.physics.arcade.collide(player, npc_hostess);
		game.physics.arcade.collide(player, welcomePack, this.collectWelcomePack);
        this.movePlayer();
    },
	collectWelcomePack: function (player, welcomePack) {
		welcomePack.kill();
  },
    movePlayer: function () {
        var vel = 200;
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

Player = function (game, x, y, atlas, startframe) {
    x *= 64;
    y *= 64;
    this.initX = x;
    this.initY = y;
    Phaser.Sprite.call(this, game, x, y, atlas, startframe);
    this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
    this.body.setSize(60, 64, 20, 80);
    //add animations
    var animVel = 5;
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
    content = game.cache.getJSON('dialogues');
    player.inputEnabled = true;
	player.SignalDistance = new Phaser.Signal();
    player.SignalDistance.add(autoHRdialog, this);
    player.SignalDistance.dispatch(576, 4352, content.point_2[1], 1);
	player.SignalDistance.dispatch(416, 3264, content.point_3[1], 2); 
	player.SignalDistance.dispatch(416, 1664, content.point_4[1], 3);
	player.SignalDistance.dispatch(416, 832, content.point_5[1], 4);
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
NPC = function (game, id_npc, position_x, position_y, atlas, startframe) {
    var position_x = npc_db[id_npc].position_x;
    var position_y = npc_db[id_npc].position_y;
    position_x *= 64;
    position_y *= 64;
    var atlas = npc_db[id_npc].atlas;
    var startframe = npc_db[id_npc].startFrame;
    var name = npc_db[id_npc].name;
    Phaser.Sprite.call(this, game, position_x, position_y, atlas, startframe);
    var vel = 5;
    this.anchor.setTo(0.5);
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(60, 64, 20, 30);
    this.type = "npc-" + name;
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    npc = this;

    if (this.type == "npc-HR") {
        npc_HR = this;
        npc_HR.events.onInputUp.addOnce(Point1, npc_HR);
    }
    if (i == 0) {
        npc_HR.addChild(game.add.sprite(-7, -85, "questimg"));
    }

    if (this.type == "npc-sasha") {
        npc_sasha = this;
        npc_sasha.events.onInputUp.add(Point4, npc_sasha);
        npc_sasha.addChild(game.add.sprite(-7, -85, "questimg"));
    }

    if (this.type == "npc-ecologist") {
        npc_ecologist = this;
        npc_ecologist.events.onInputUp.add(Point5, npc_ecologist);
        npc_ecologist.addChild(game.add.sprite(-7, -85, "questimg"));
    }
    if (this.type == "npc-hostess") {
        npc_hostess = this;
		npc_hostess.events.onInputUp.add(Point6, npc_hostess);
        npc_hostess.addChild(game.add.sprite(-7, -85, "questimg"));
    }

    this.animations.add('idle-front', [name + '-idle-front'], 0, true);
    this.animations.add('idle-back', [name + '-idle-back'], 0, true);
    this.animations.add('idle-side', [name + '-idle-side'], 0, true);
    this.animations.add('walk-front', Phaser.Animation.generateFrameNames(name + '-walk-front-', 1, 4, '', 0), vel, true);
    this.animations.add('walk-back', Phaser.Animation.generateFrameNames(name + '-walk-back-', 1, 4, '', 0), vel, true);
    this.animations.add('walk-side', Phaser.Animation.generateFrameNames(name + '-walk-side-', 1, 4, '', 0), vel, true);

    this.events.onInputOver.add(glow, this);
    this.events.onInputOut.add(glow_remove, this);

    function glow() {
		if (this.deltaX == 0 && this.deltaY == 0) // если не двигается
		{
        if (this.type == "npc-HR") {
            glower = npc_HR.addChild(game.add.sprite(-52, -56, "glow", "HR"));
        }
        if (this.type == "npc-sasha") {
            glower = npc_sasha.addChild(game.add.sprite(-52, -60, "glow", "sasha"));
        }
        if (this.type == "npc-ecologist") {
            glower = npc_ecologist.addChild(game.add.sprite(-52, -60, "glow", "ecologist"));
        }
        if (this.type == "npc-hostess") {
            glower = npc_hostess.addChild(game.add.sprite(-52, -60, "glow", "hostess"));
        }
		}
					}
    function glow_remove() {
        this.removeChild(glower);
    }

}
NPC.prototype = Object.create(Phaser.Sprite.prototype);
NPC.prototype.constructor = NPC;
NPC.prototype.update = function () {

    if (this.deltaX > 0) {
        this.animations.play("walk-side");
        this.scale.x = 1;
    } else if (this.deltaX < 0) {
        this.animations.play("walk-side");
        this.scale.x = -1;
    } else if (this.deltaY > 0) {
        this.animations.play("walk-front");
        this.scale.x = 1;
    } else if (this.deltaY < 0) {
        this.animations.play("walk-back");
        this.scale.x = 1;
    } else if (this.body.velocity.x == 0) {
        this.animations.play("idle-front");
    } else if (this.body.velocity.y == 0) {
        this.animations.play("idle-front");
    }
}

var i = 0;
dialogbuttons = [];
dialogbuttons[0] = {
    name: "nextbutton",
    x: 931,
    y: 560,
}
dialogbuttons[1] = {
    name: "okbutton",
    x: 975,
    y: 560,
}
var groupDialogWin;
function DialogWin(content, i, dialogbuttons) {
    //content = game.cache.getJSON('dialogues');
    groupDialogWin = game.add.group();
    dialogframe = game.add.image(0, 448, "dialogframe");
    dialogframe.fixedToCamera = true;
    dialogtext = game.add.bitmapText(50, 490, "pixel_font", content, 24);
    dialogtext.lineSpacing = -7;
    dialogtext.fixedToCamera = true;
    nextbutton = game.add.button(dialogbuttons.x, dialogbuttons.y, dialogbuttons.name);
    nextbutton.fixedToCamera = true;

    groupDialogWin.addMultiple([dialogframe, dialogtext, nextbutton]);
}

var switchKey = 1;
var keyAutoDialog = 1;
function autoHRdialog(x, y, content, keyAutoDialog) {
    var distance = game.physics.arcade.distanceToXY(player, x, y);
    if (npc_HR.position.x == x && distance < 110 && switchKey == keyAutoDialog) {
        DialogWin(content, i, dialogbuttons[1]);
        if (keyAutoDialog == 1 || keyAutoDialog == 3 || keyAutoDialog == 4) {
            nextbutton.onInputUp.add(destroyGroupDialogWin, this);
        }
        if (keyAutoDialog == 2) {
            nextbutton.loadTexture("nextbutton");
            nextbutton.cameraOffset.setTo(931, 560);
            nextbutton.onInputUp.add(Point3, this);
        }
        switchKey++;
    }
}
function destroyGroupDialogWin() {
    groupDialogWin.removeChildren();
}

var point1_key = 1;
var Point1 = function () {

    npc_HR.removeChildren(0, 4);
    content = game.cache.getJSON('dialogues');
    DialogWin(content.point_1[point1_key], point1_key, dialogbuttons[0]);
    nextbutton.onInputUp.add(updateTextPoint1, this);
    if (point1_key == 3) {
        dialogtext.fontSize = 19;
    }
    if (point1_key == 5) {
        nextbutton.loadTexture(dialogbuttons[1].name);
        nextbutton.cameraOffset.setTo(dialogbuttons[1].x, dialogbuttons[1].y);
    }
    if (point1_key == 6) {
        groupDialogWin.removeChildren();
        point1_key++;
        removeBarrier();
        HRmove();
    }
}

function updateTextPoint1() {
    groupDialogWin.removeChildren();
    point1_key++;
    Point1();
}
var point2_key = 2;
function Point2() {
    if (point2_key == 2 || point2_key == 8) {
        chewbacca.events.onInputUp.add(mission, this);
    }
    function mission() {

        DialogWin(content.point_2[2], i, dialogbuttons[0]);
        dialogframe.loadTexture("mission");
        dialogframe.cameraOffset.setTo(320, 96);

        missiontext = game.add.bitmapText(470, 140, "pixel_font", "МИССИЯ", 30);
        missiontext.fixedToCamera = true;

        dialogtext.align = "center";
        dialogtext.cameraOffset.setTo(364, 190);

        nextbutton.cameraOffset.setTo(490, 460);
        nextbutton.onInputUp.add(updateText, this);
        point2_key++;

        function updateText() {
            content = game.cache.getJSON('dialogues');
            if (point2_key == 3 || point2_key == 9 || point2_key == 10) {
                dialogtext.fontSize = 17;
                nextbutton.onInputUp.add(updateText, this);
            }
            if (point2_key == 4 || point2_key == 11) {
                dialogtext.fontSize = 20;
                nextbutton.loadTexture(dialogbuttons[1].name);
                nextbutton.cameraOffset.setTo(512, 460);
                nextbutton.onInputUp.add(closemission, this);
            }
            dialogtext.text = content.point_2[point2_key];
            point2_key++;
        }
    }
    function closemission() {
        groupDialogWin.removeChildren();
        missiontext.destroy();
        DialogWin(content.point_2[5], i, dialogbuttons[1]);
        nextbutton.onInputUp.addOnce(toPoint3, this);
    }
    function toPoint3() {
        point2_key++;
        groupDialogWin.removeChildren();
        removeBarrier();
        HRmove();
    }
}

//tween = game.add.tween(dialogframe.scale).to( { x: 2, y: 2 }, 2000, Phaser.Easing.Bounce.Out, true);
var point3_key = 1;
function Point3() {
    if (point3_key == 1) {
        dialogtext.text = content.point_3[2];
        nextbutton.onInputUp.addOnce(questBooks, this);
    }
}
    function questBooks() {
		point3_key++;
        dialogtext.text = content.point_3[3];
        nextbutton.loadTexture("okbutton");
        nextbutton.cameraOffset.setTo(975, 560);
        nextbutton.onInputUp.addOnce(destroyGroupDialogWin, this);
        // счетчик
        counterFrame = game.add.image(0, gameHeight, "counter0");
        counterFrame.fixedToCamera = true;
        counterFrame.cameraOffset.setTo(848, 0);
        counterText = game.add.bitmapText(945, 52, "pixel_font", "0/3", 24);
        counterText.fixedToCamera = true;
        counterBook = 0;
    }

var checkTheAlliance = 0;
var checkVremyaIgr = 0;
var checkIgravCifri = 0;

function selectBook(a, b, c, coverBook, bookY) {
    book = game.add.image(561, bookY, coverBook);
    book.fixedToCamera = true;
    book.anchor.setTo(0.5, 0.5);
    continueButton = game.add.button(396, 530, "continue_b");
    continueButton.fixedToCamera = true;
    continueButton.onInputUp.add(destroyBook, this);
    selectButton = game.add.button(560, 538, "select_b");
    selectButton.fixedToCamera = true;
    selectButton.onInputUp.add(BookSelectionAnimation, this);

    if (book.key == "thealliance" && checkTheAlliance == 1) {
        selectButton.destroy();
    }
    if (book.key == "vremyaigr" && checkVremyaIgr == 1) {
        selectButton.destroy();
    }
    if (book.key == "igravcifri" && checkIgravCifri == 1) {
        selectButton.destroy();
    }
    if (counterBook == 3) {
        selectButton.destroy();
    }

}

function BookSelectionAnimation() {
    if (book.key == "thealliance" || book.key == "vremyaigr" || book.key == "igravcifri") {
        tween = game.add.tween(book.scale).to({
            x: 1.2,
            y: 1.2
        }, 500, Phaser.Easing.Back.Out, true, 0, 0, true);
        selectButton.destroy();
        counterBook++;
        updateCounterBook();
        if (book.key == "thealliance") {
            checkTheAlliance = 1;
        }
        if (book.key == "vremyaigr") {
            checkVremyaIgr = 1;
        }
        if (book.key == "igravcifri") {
            checkIgravCifri = 1;
        }
    } else {
        game.add.tween(book.cameraOffset).to({
            x: book.cameraOffset.x - 20
        }, 100, Phaser.Easing.Bounce.InOut, true, 0, 3, true);
    }
}
function updateCounterBook() {
    if (counterBook == 1) {
        counterFrame.loadTexture("counter1");
        counterText.text = "1/3";
    }
    if (counterBook == 2) {
        counterFrame.loadTexture("counter2");
        counterText.text = "2/3";
    }
    if (counterBook == 3) {
        counterFrame.loadTexture("counter3");
        counterText.text = "3/3";
        timer = game.time.create();
        timer.add(3000, toPoint4, this);
        timer.start();
    }
}

function toPoint4() {
    destroyBook();
    counterFrame.destroy();
    counterText.destroy();
    removeBarrier();
    HRmove();
}

function destroyBook() {
    book.destroy();
    continueButton.destroy();
    selectButton.destroy();
}
var point4_key = 1;
var Point4 = function () {
    npc_sasha.removeChildren(0, 4);
    content = game.cache.getJSON('dialogues');
    DialogWin(content.point_4[2], i, dialogbuttons[1]);
    dialogtext.fontSize = 18;
    nextbutton.onInputUp.add(hrText, this);
    point4_key++;

    function hrText() {
        dialogtext.fontSize = 24;
        dialogtext.text = content.point_4[3];
        nextbutton.loadTexture("okbutton");
        nextbutton.cameraOffset.setTo(975, 560);
        nextbutton.onInputUp.add(toPoint5, this);
    }
    function toPoint5() {
        groupDialogWin.removeChildren();
        removeBarrier();
        HRmove();
    }
}

var point5_key = 2;
var Point5 = function () {
    npc_ecologist.removeChildren(0, 4);
    content = game.cache.getJSON('dialogues');
    DialogWin(content.point_5[2], i, dialogbuttons[0]);
	point5_key++;
    nextbutton.onInputUp.add(updateText, this);
    
	
	function updateText(){
		dialogtext.text = content.point_5[point5_key];
		nextbutton.onInputUp.add(updateText, this);
		point5_key++;
		if (point5_key == 5){
		dialogtext.fontSize = 22;
		}
		if (point5_key == 6){
		dialogtext.text = content.point_5[5];
        nextbutton.loadTexture("okbutton");
        nextbutton.cameraOffset.setTo(975, 560);
		nextbutton.onInputUp.add(toPoint6, this);
		}
		 
	}


}
	 function toPoint6() {
        groupDialogWin.removeChildren();
        HRmove();
    }
  
var Point6 = function () {
    npc_hostess.removeChildren(0, 4);
    content = game.cache.getJSON('dialogues');
    DialogWin(content.point_6[1], i, dialogbuttons[1]);
    dialogtext.fontSize = 20;
    nextbutton.onInputUp.add(questWelcomePack, this);
    counter_wp = game.add.image(848, 0, "counter_wp");
		counter_wp.fixedToCamera = true;

    function questWelcomePack() {
        welcomePack.setAll("body.enable", true);
        groupDialogWin.removeChildren();
        //если счетчик выполнен. то окно с предупреждением и таймером
        // если не успел, то player появляется на этаж выше и бежит на чердак player.reset
        // если опять не успел, то появляется еще на этаж выше к чердаку

    }
}
function checkmark() {
    if (welcomePack.children[0].alive == false) {
        game.add.sprite(891, 51, 'done_wp').fixedToCamera = true;
    }
    if (welcomePack.children[1].alive == false) {
        game.add.sprite(891, 135, 'done_wp').fixedToCamera = true;
    }
    if (welcomePack.children[2].alive == false) {
        game.add.sprite(891, 107, 'done_wp').fixedToCamera = true;
    }
    if (welcomePack.children[3].alive == false) {
        game.add.sprite(891, 163, 'done_wp').fixedToCamera = true;
    }
    if (welcomePack.children[4].alive == false) {
        game.add.sprite(891, 79, 'done_wp').fixedToCamera = true;
    }
}
function removeBarrier() {
    //na 2 etaj
    if (point1_key == 7) {
        globalMap.removeTile(7, 91, "Collisions");
        globalMap.removeTile(8, 91, "Collisions");
        globalMap.removeTile(9, 91, "Collisions");
    }
    if (point2_key == 7) {
        globalMap.removeTile(4, 66, "Collisions");
        globalMap.removeTile(5, 66, "Collisions");
        globalMap.removeTile(6, 66, "Collisions");
    }
    if (point3_key == 2) {
        globalMap.removeTile(1, 41, "Collisions");
        globalMap.removeTile(2, 41, "Collisions");
        globalMap.removeTile(3, 41, "Collisions");
    }
    if (point4_key == 2) {
        globalMap.removeTile(8, 24, "Collisions");
        globalMap.removeTile(9, 24, "Collisions");
    }
}
function HRmove() {
    // к чуббаке
    if (point1_key == 7) {
        point1tween1 = game.add.tween(npc_HR).to({
            x: 544,
            y: 5888
        }, 1000, "Linear", true);
        point1tween2 = game.add.tween(npc_HR).to({
            x: 544,
            y: 4736
        }, 9000, "Linear", false);
        point1tween3 = game.add.tween(npc_HR).to({
            x: 352,
            y: 4736
        }, 2000, "Linear", false);
        point1tween4 = game.add.tween(npc_HR).to({
            x: 352,
            y: 4300
        }, 5000, "Linear", false);
        point1tween5 = game.add.tween(npc_HR).to({
            x: 576,
            y: 4300
        }, 3000, "Linear", false);
        point1tween1.chain(point1tween2, point1tween3, point1tween4, point1tween5);
        point1tween5.onComplete.addOnce(Point2, this);
        point1_key = 0;
    }
    // к библиотеке
    if (point2_key == 7) {
        point2tween1 = game.add.tween(npc_HR).to({
            x: 576,
            y: 4352
        }, 1000, "Linear", true);
        point2tween2 = game.add.tween(npc_HR).to({
            x: 352,
            y: 4352
        }, 3000, "Linear", false);
        point2tween3 = game.add.tween(npc_HR).to({
            x: 352,
            y: 3392
        }, 8000, "Linear", false);
        point2tween4 = game.add.tween(npc_HR).to({
            x: 416,
            y: 3392
        }, 1000, "Linear", false);
        point2tween5 = game.add.tween(npc_HR).to({
            x: 416,
            y: 3264
        }, 2000, "Linear", false);
        point2tween1.chain(point2tween2, point2tween3, point2tween4, point2tween5);
        point2tween5.onComplete.addOnce(Point3, this);
        point2_key = 8;
    }
    // к Саше
    if (point3_key == 2) {
        point3tween1 = game.add.tween(npc_HR).to({
            x: 416,
            y: 3008
        }, 3000, "Linear", true);
        point3tween2 = game.add.tween(npc_HR).to({
            x: 224,
            y: 3008
        }, 2000, "Linear", false);
        point3tween3 = game.add.tween(npc_HR).to({
            x: 224,
            y: 2176
        }, 5000, "Linear", false);
        point3tween4 = game.add.tween(npc_HR).to({
            x: 416,
            y: 2176
        }, 1000, "Linear", false);
        point3tween5 = game.add.tween(npc_HR).to({
            x: 416,
            y: 1664
        }, 5000, "Linear", false);
        point3tween1.chain(point3tween2, point3tween3, point3tween4, point3tween5);
        point3_key = 0;
    }
    // к экологу
    if (point4_key == 2) {
        point4tween1 = game.add.tween(npc_HR).to({
            x: 8.5 * 64,
            y: 26 * 64
        }, 1500, "Linear", true);
        point4tween2 = game.add.tween(npc_HR).to({
            x: 8.5 * 64,
            y: 19 * 64
        }, 5000, "Linear", false);
        point4tween3 = game.add.tween(npc_HR).to({
            x: 7.5 * 64,
            y: 19 * 64
        }, 1000, "Linear", false);
        point4tween4 = game.add.tween(npc_HR).to({
            x: 7.5 * 64,
            y: 13 * 64
        }, 5000, "Linear", false);
        point4tween5 = game.add.tween(npc_HR).to({
            x: 6.5 * 64,
            y: 13 * 64
        }, 1000, "Linear", false);
        point4tween1.chain(point4tween2, point4tween3, point4tween4, point4tween5);
        point4_key = 0;
    }
    // к хостесс
    if (point5_key == 7) {
        point5tween1 = game.add.tween(npc_HR).to({
            x: 10.5 * 64,
            y: 13 * 64
        }, 2500, "Linear", true);
        point5tween2 = game.add.tween(npc_HR).to({
            x: 10.5 * 64,
            y: 8.8 * 64
        }, 3000, "Linear", false);
        point5tween3 = game.add.tween(npc_HR).to({
            x: 14.5 * 64,
            y: 8.8 * 64
        }, 2000, "Linear", false);
        point5tween4 = game.add.tween(npc_HR).to({
            x: 14.5 * 64,
            y: 5 * 64
        }, 2000, "Linear", false);
        point5tween1.chain(point5tween2, point5tween3, point5tween4);
        point5_key = 0;
    }
}

 