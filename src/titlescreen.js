var titleScreen = function (game) {};
titleScreen.prototype = {
    create: function () {
		music = game.sound.play('Synthwave',0.4, true);
		background = game.add.video('title-bg');
		background.volume = 0;
		background.play(true);
		background.addToWorld();
      //  background = game.add.image(0, 0, "title-bg");
        this.title = game.add.image(game.width - 544, 200, "logo");
        this.title.anchor.setTo(0.5);
        this.title.alpha = 0;
        var tween = game.add.tween(this.title).to({
            alpha: 1
        }, 4000, "Linear", true);
        tween.start();
        //
        this.pressEnter = game.add.image(game.width - 544, 320, "title-press-enter");
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
            this.title2 = game.add.image(game.width - 544, 230, 'instructions');
            this.title2.anchor.setTo(0.5);
            var startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            startKey.onDown.add(this.selectpersGame, this);
        }
    },

    selectpersGame: function (hero, heroine) {
        this.selectpers = game.add.image(game.width - 544, 230, 'select-pers');
        this.selectpers.anchor.setTo(0.5);
        hero = game.add.image(440, 190, 'personages', 'hero-idle-front');
        hero.inputEnabled = true;
        heroine = game.add.image(560, 190, 'personages', 'heroine-idle-front');
        heroine.inputEnabled = true;
        const getSetAlphaCallback = (character, alpha) => () => {
            character.alpha = alpha;
        }
        [hero, heroine].forEach((character) => {
            character.events.onInputOver.add(getSetAlphaCallback(character, alpha = 0.5), this)
            character.events.onInputOut.add(getSetAlphaCallback(character, alpha = 1), this)
        }, )
        hero.events.onInputUp.add(selectHero, this);
        heroine.events.onInputUp.add(selectHeroine, this);

        function selectHero() {
			game.sound.play('dialog');
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
        function selectHeroine() {
			game.sound.play('dialog');
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