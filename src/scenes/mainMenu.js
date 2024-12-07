MainMenuState = {};

MainMenuState.init = function (data) {
    this.game.renderer.renderSession.roundPixels = true;

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

    this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
};

MainMenuState.preload = function () {
    this.game.load.json('start0', 'data/start0.json');
	this.game.load.image('startgame', 'images/startgame.jpg');
	this.game.load.image('ground', 'images/ground.png');

    this.game.load.image('button', 'images/websitelogo1.png');
    this.game.load.image('grass:6x1', 'images/starttile.png');
	
	this.game.load.image('button2', 'images/instagramlogo.png');
	this.game.load.image('button3', 'images/facebooklogo.png');
	
    this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
    
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:platform', 'audio/coin.wav');
};

var button;
MainMenuState.create = function () {
	    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        platform: this.game.add.audio('sfx:platform'),
    };
    // create level
    this.game.add.image(0, 0, 'startgame');
    this._loadLevel(this.game.cache.getJSON('start0'));

	button = this.game.add.button(855, 26, 'button', openWindow, this);
	button.input.useHandCursor = true;
	buttonInsta = this.game.add.button(855, 126, 'button2', openInsta, this);
	buttonFace = this.game.add.button(855, 226, 'button3', openFace, this);

};
function openWindow() {
    window.open("https://forms.gle/gW5an78GgXbbZtas9", "_blank")
}

MainMenuState.update = function () {
    this._handleCollisions();
    this._handleInput();
};

MainMenuState._handleCollisions = function () {
   this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.overlap(this.hero, this.coin, this._onHeroVsCoin,
        null, this);
		
};

MainMenuState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    } else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    } else { // stop
        this.hero.move(0);
    }
};
MainMenuState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.platforms = this.game.add.group();
	this.coin = this.game.add.group();
    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
	data.coin.forEach(this._spawnCoin, this);
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero});
    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

MainMenuState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

MainMenuState._spawnCoin = function (coin) {
    let sprite = this.coin.create(coin.x, coin.y, coin.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

MainMenuState._spawnCharacters = function (data) {
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

MainMenuState._onHeroVsCoin = function (hero, platform) {
    this.sfx.platform.play();
    platform.kill();
	//startGame = true;
	this.game.state.add('play', PlayState);
		this.game.state.start('play', true, false, {level: 0});
};

MainMenuState.shutdown = function () {}