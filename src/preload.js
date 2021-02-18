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
npc_HR,
npc_sasha,
npc_ecologist,
npc_hostess,
distance,
groupGlow,
welcomePack,
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
        game.load.image("questimg", "assets/sprites/quest.png");
        game.load.image("chewbacca", "assets/sprites/chewbacca.png");
        game.load.image("mission", "assets/sprites/mission.png");
        game.load.image("book_glow", "assets/sprites/book_glow.png");
        game.load.image("book_glow4", "assets/sprites/4.png");
        game.load.image("book_glow5", "assets/sprites/5.png");
        game.load.image("book_glow6", "assets/sprites/6.png");
        game.load.image("igravcifri", "assets/sprites/igravcifri.png");
        game.load.image("select_b", "assets/sprites/select_b.png");
        game.load.image("continue_b", "assets/sprites/continue_b.png");
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
		
		game.load.image("pen", "assets/sprites/pen.png");
		game.load.image("notepad", "assets/sprites/notepad.png");
		game.load.image("pillow", "assets/sprites/pillow.png");
		game.load.image("pack", "assets/sprites/pack.png");
		game.load.image("cup", "assets/sprites/cup.png");

    },
    create: function () {
        this.game.state.start("TitleScreen");
    }

}