var game,
player,
gameWidth = 1088,
gameHeight = 640,
globalMap,
background,
hero,
heroine,
music,
npc,
npc_db,
mobs_db,
id_mob,
mob_walkers,
mob,
id_npc,
content,
npc_HR,
npc_sasha,
npc_ecologist,
npc_hostess,
distance,
groupGlow,
welcomePack,
group_mob_walkers,
group_mob,
groupBook,
chewbacca,
counter,
updateCounter,
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

var boot = function (game) {};
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

var preload = function (game) {};
preload.prototype = {
    preload: function () {
        var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5);
        game.load.setPreloadSprite(loadingBar);
        // load title screen
      //  game.load.image("title-bg", "assets/title/bg.gif");
		game.load.video('title-bg', 'assets/title/bg.webm');
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
        // json
        game.load.json('npc', 'NPC.json');
		game.load.json('mobsDB', 'mobsDB.json');
        game.load.json('dialogues', 'dialogues.json');
        //font
        game.load.bitmapFont('pixel_font', 'assets/fonts/pixel_font.png', 'assets/fonts/pixel_font.xml');
        //elements
        game.load.image('dialogframe', 'assets/sprites/dialog.png');
		game.load.spritesheet('nextbutton', 'assets/sprites/nextbutton.png', 108, 36);
		game.load.spritesheet('okbutton', 'assets/sprites/okbutton.png', 64, 40);
        game.load.image("questimg", "assets/sprites/quest.png");
        game.load.image("chewbacca", "assets/sprites/chewbacca.png");
        game.load.image("mission", "assets/sprites/mission.png");
        game.load.image("book_glow", "assets/sprites/book_glow.png");
        game.load.image("book_glow4", "assets/sprites/4.png");
        game.load.image("book_glow5", "assets/sprites/5.png");
        game.load.image("book_glow6", "assets/sprites/6.png");
        game.load.image("igravcifri", "assets/sprites/igravcifri.png");
		game.load.spritesheet('select_b', 'assets/sprites/select_b.png', 132, 40);
		game.load.spritesheet('continue_b', 'assets/sprites/continue_b.png', 140, 56);
        game.load.image("thealliance", "assets/sprites/thealliance.png");
        game.load.image("vremyaigr", "assets/sprites/vremyaigr.png");
        game.load.image("book", "assets/sprites/book.png");
        game.load.image("book2", "assets/sprites/book2.png");
        game.load.image("counter0", "assets/sprites/counter0.png");
        game.load.image("counter1", "assets/sprites/counter1.png");
        game.load.image("counter2", "assets/sprites/counter2.png");
        game.load.image("counter3", "assets/sprites/counter3.png");
		game.load.image("counter_wp", "assets/sprites/counter_wp.png");
		game.load.image("done_wp", "assets/sprites/done_wp.png");
		game.load.image("message", "assets/sprites/message.png");
		game.load.image("countdown", "assets/sprites/countdown.png");
		game.load.image("pizza", "assets/sprites/pizza.png");
		game.load.image("WPX_MESSAGE", "assets/sprites/WPX_MESSAGE.png");
		game.load.image("WTX", "assets/sprites/WTX.png");
		game.load.atlasJSONArray("ball_b", "assets/sprites/ball_b.png", "assets/sprites/ball_b.json");
		game.load.atlasJSONArray("ball_g", "assets/sprites/ball_g.png", "assets/sprites/ball_b.json");
		game.load.atlasJSONArray("ball_p", "assets/sprites/ball_p.png", "assets/sprites/ball_b.json");
		game.load.atlasJSONArray("ball_r", "assets/sprites/ball_r.png", "assets/sprites/ball_b.json");
		game.load.atlasJSONArray("ball_y", "assets/sprites/ball_y.png", "assets/sprites/ball_b.json");
		game.load.image("pen", "assets/sprites/pen.png");
		game.load.image("pen_glow", "assets/sprites/pen_glow.png");
		game.load.image("notepad", "assets/sprites/notepad.png");
		game.load.image("notepad_glow", "assets/sprites/notepad_glow.png");
		game.load.image("pillow", "assets/sprites/pillow.png");
		game.load.image("pillow_glow", "assets/sprites/pillow_glow.png");
		game.load.image("pack", "assets/sprites/pack.png");
		game.load.image("pack_glow", "assets/sprites/pack_glow.png");
		game.load.image("cup", "assets/sprites/cup.png");
		game.load.image("cup_glow", "assets/sprites/cup_glow.png");
		game.load.image("air_hockey", "assets/sprites/airHockey.png");
		game.load.image("puck", "assets/sprites/puck.png");
		game.load.spritesheet('speaker', 'assets/sprites/speaker.png', 286, 220, 4);
		
		game.load.image("1_track", "assets/sprites/1_track.png");
		game.load.image("business", "assets/sprites/business.png");
		game.load.image("hey_listen", "assets/sprites/hey_listen.png");
		game.load.image("kojima", "assets/sprites/kojima.png");
		game.load.image("loves", "assets/sprites/loves.png");
		game.load.image("minecraft", "assets/sprites/minecraft.png");
		
		//аудио
		game.load.audio('Synthwave','assets/audio/Electronic_80s_Synthwave.wav');
		game.load.audio('bookOpen', 'assets/audio/bookOpen.ogg');
		game.load.audio('bookClose', 'assets/audio/bookClose.ogg');
		game.load.audio('error', 'assets/audio/error.ogg');
		game.load.audio('true','assets/audio/true.wav');
		game.load.audio('collectWP','assets/audio/collectWP.ogg');
		game.load.audio('click','assets/audio/click.wav');
		game.load.audio('reset', 'assets/audio/reset.mp3');
		game.load.audio('victory','assets/audio/victory.ogg');
		game.load.audio('tick_tock','assets/audio/tick_tock.wav');
		game.load.audio('dialog','assets/audio/dialog.wav');

		
		//mobs
		game.load.atlasJSONArray("mobs", "assets/atlas/mobs.png", "assets/atlas/mobs.json");
		game.load.atlasJSONArray("mobs-walkers", "assets/atlas/mobs-walkers.png", "assets/atlas/mobs-walkers.json");


    },
    create: function () {
        this.game.state.start("TitleScreen");
    }

}