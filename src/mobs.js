
Mobs = function (game, id_mob, mob_x, mob_y) {
	var mob_x = mobs_db[id_mob].mob_x;
	var mob_y = mobs_db[id_mob].mob_y;
	var name = mobs_db[id_mob].name;
	var rate = mobs_db[id_mob].rate;
	var framesMob = mobs_db[id_mob].frames;
	mob = game.add.sprite(mob_x, mob_y, "mobs", name + "-anim-1");
		mob.animations.add('anim', framesMob, rate, true);
		mob.animations.play("anim");
	group_mob.add(mob);
    }

MobsWalkers = function (game, id_mob, mob_x, mob_y) {
	var mob_x = mobs_db[id_mob].mob_x;
	var mob_y = mobs_db[id_mob].mob_y;
	var name = mobs_db[id_mob].name;
	mob_walkers = game.add.sprite(mob_x, mob_y, "mobs-walkers", name + "-idle-front");
	group_mob_walkers.add(mob_walkers);
	
		mob_walkers.animations.add('idle-front', [name + '-idle-front'], 0, true);
		mob_walkers.animations.add('walk-front', Phaser.Animation.generateFrameNames(name + '-walk-front-', 1, 4, '', 0), 4, true);
		mob_walkers.animations.add('walk-back', Phaser.Animation.generateFrameNames(name + '-walk-back-', 1, 4, '', 0), 4, true);
		mob_walkers.animations.add('walk-left', Phaser.Animation.generateFrameNames(name + '-walk-left-', 1, 4, '', 0), 4, true);
		mob_walkers.animations.add('walk-right', Phaser.Animation.generateFrameNames(name + '-walk-right-', 1, 4, '', 0), 4, true);
		
		tween = game.add.tween(mob_walkers).to({ x: mobs_db[id_mob].tween.x, y: mobs_db[id_mob].tween.y }, mobs_db[id_mob].tween.duration, 'Linear', true, 0, -1);	
	 
/* 	group_mob_walkers.setAllChildren("body.width", 60);
group_mob_walkers.setAllChildren("body.height", 64);
group_mob_walkers.setAllChildren("body.offset.x", 20);
group_mob_walkers.setAllChildren("body.offset.y", 30); */

		
	mob_walkers.update = function () 
	{
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
	