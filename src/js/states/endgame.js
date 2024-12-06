EndGameState = {};

EndGameState.init = function (data) {
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
EndGameState.preload = function () {
    this.game.load.json('start0', 'data/start0.json');
	this.game.load.image('endgame', 'images/endgame.jpg');
	this.game.load.image('ground', 'images/ground.png');
    
	/////////////////////////
	
	this.game.load.image('button', 'images/websitelogo1.png');
	this.game.load.image('button1', 'images/restarttile.png');
	//this.game.load.image('button2', 'images/instagramlogo.png');
	//this.game.load.image('button3', 'images/facebooklogo.png');
    
    
    this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
    
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:platform', 'audio/coin.wav');
};
var buttonWeb;
var buttonRestart;
var buttonInsta;
var buttonFace;

EndGameState.create = function () {
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        //platform: this.game.add.audio('sfx:platform'),
    };
    // create level
    this.game.add.image(0, 0, 'endgame');
    this._loadLevel(this.game.cache.getJSON('start0'));
	//////////////////////////////
	buttonWeb = this.game.add.button(450, 240, 'button', openWindow, this);
	buttonWeb.input.useHandCursor = true;
	buttonRestart = this.game.add.button(400, 340, 'button1', restartGame, this);
	//buttonInsta = this.game.add.button(290, 240, 'button2', openInsta, this);
	//buttonFace = this.game.add.button(600, 240, 'button3', openFace, this);
};
/////////////////
function openInsta() {
 window.open("https://www.instagram.com/kuychiproject/", "_blank")
    }
function openFace() {
 window.open("https://www.facebook.com/Kuychi-435800183533124/", "_blank")
    }	

function restartGame() {
	//this.game.state.add('main', MainMenuState);
	this.game.state.start('main', true, false, 'start0');
}

EndGameState.update = function () {
    this._handleCollisions();
    this._handleInput();
};
EndGameState._handleCollisions = function () {
   this.game.physics.arcade.collide(this.hero, this.platforms);
    //this.game.physics.arcade.collide(this.hero, this.coin, this._onHeroVsCoin,null, this);
};
EndGameState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else { // stop
        this.hero.move(0);
    }
};
EndGameState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.platforms = this.game.add.group();
	//this.coin = this.game.add.group();
    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
	//data.coin.forEach(this._spawnCoin, this);
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero});
    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

EndGameState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};
EndGameState._spawnCoin = function (coin) {
    let sprite = this.coin.create(
        coin.x, coin.y, coin.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

EndGameState._spawnCharacters = function (data) {
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

EndGameState._onHeroVsCoin = function (hero, platform) {
	//openWeb = true;
   // this.sfx.platform.play();
    //platform.kill();
	//startGame = true;
	//if (openWeb === true) {
	//window.open("http://www.kuychiproject.com/", "_blank");
	//openWeb = false;
	//}
	//this.game.state.add('main', MainMenuState);
		//this.game.state.start('main', true, false, 'start0');
};
EndGameState.shutdown = function () {
	//this.hero.kill();
};