
Mobs = function (game, id_mob, mob_x, mob_y) {
	var mob_x = mobs_db[id_mob].mob_x;
	var mob_y = mobs_db[id_mob].mob_y;
	var id = mobs_db[id_mob].id;
	var rate = mobs_db[id_mob].rate;
	var framesMob = mobs_db[id_mob].frames;
	var name = mobs_db[id_mob].name;
	mob = game.add.sprite(mob_x, mob_y, "mobs", id + "-anim-1");
		mob.animations.add('anim', framesMob, rate, true);
		mob.animations.play("anim");
	group_mob.add(mob);
	group_mob.setAll("body.immovable", true);
	group_mob.setAll("body.width", 64);
	group_mob.setAll("body.height", 160);
	group_mob.setAll("body.offset.x", 20);
	group_mob.setAll("body.offset.y", 28);
	group_mob.setAll("inputEnabled", true);
    group_mob.setAll("input.useHandCursor", true);
	
	
	const getNameCallback = (mob) => () => {
            mob.addChild(t = game.add.text(52, 0, name, {fill: "#ffffff", fontSize: 16, stroke: "#d2004a", strokeThickness: 5} ));
			t.anchor.x=0.5;
			//mob.addChild(game.add.image(30, -30, 'mobs20DialogBox'));
        }
	const SetNameCallback = (mob) => () => {
            mob.removeChildren();
        }
        group_mob.forEach(() => {
            mob.events.onInputOver.add(getNameCallback(mob), this)
            mob.events.onInputOut.add(SetNameCallback(mob), this)
        }, );
	
    }

MobsWalkers = function (game, id_mob, mob_x, mob_y) {
	var mob_x = mobs_db[id_mob].mob_x;
	var mob_y = mobs_db[id_mob].mob_y;
	var id = mobs_db[id_mob].id;
	var name = mobs_db[id_mob].name;
	mob_walkers = game.add.sprite(mob_x, mob_y, "mobs-walkers", id + "-idle-front");
	group_mob_walkers.add(mob_walkers);
	group_mob_walkers.setAll("body.immovable", true);
	group_mob_walkers.setAll("body.width", 64);
	group_mob_walkers.setAll("body.height", 160);
	group_mob_walkers.setAll("body.offset.x", 16);
	group_mob_walkers.setAll("body.offset.y", 36);
	group_mob_walkers.setAll("inputEnabled", true);
    group_mob_walkers.setAll("input.useHandCursor", true);
	
	
		mob_walkers.animations.add('idle-front', [id + '-idle-front'], 0, true);
		mob_walkers.animations.add('walk-front', Phaser.Animation.generateFrameNames(id + '-walk-front-', 1, 4, '', 0), 4, true);
		mob_walkers.animations.add('walk-back', Phaser.Animation.generateFrameNames(id + '-walk-back-', 1, 4, '', 0), 4, true);
		mob_walkers.animations.add('walk-left', Phaser.Animation.generateFrameNames(id + '-walk-left-', 1, 4, '', 0), 4, true);
		mob_walkers.animations.add('walk-right', Phaser.Animation.generateFrameNames(id + '-walk-right-', 1, 4, '', 0), 4, true);
		
		tween = game.add.tween(mob_walkers).to({ x: mobs_db[id_mob].tween.x, y: mobs_db[id_mob].tween.y }, mobs_db[id_mob].tween.duration, 'Linear', true, 0, -1);	
		
	const getNameCallback = (mob_walkers) => () => {
            mob_walkers.addChild(t = game.add.text(52, 0, name, {fill: "#ffffff", fontSize: 16, stroke: "#d2004a", strokeThickness: 5} ));
			t.anchor.x=0.5;
        }
	const SetNameCallback = (mob_walkers) => () => {
            mob_walkers.removeChildren();
        }
        group_mob_walkers.forEach(() => {
            mob_walkers.events.onInputOver.add(getNameCallback(mob_walkers), this)
            mob_walkers.events.onInputOut.add(SetNameCallback(mob_walkers), this)
        }, );

		
	 mob_walkers.update = function () 
	{
		/* if (this.overlap(player))
	{
		player.alpha = 0.3;
	}
	else {player.alpha = 1;} */ 
		
		
	    if (this.deltaX > 0) {
	        this.animations.play("walk-right");
	        this.scale.x = 1;
	    } else if (this.deltaX < 0) {
	        this.animations.play("walk-left");
	        this.scale.x = 1;
	    } else if (this.deltaY > 0) {
	        this.animations.play("walk-front");
	        this.scale.x = 1;
	    } else if (this.deltaY < 0) {
	        this.animations.play("walk-back");
	        this.scale.x = 1;
	    }
	}
 }
	