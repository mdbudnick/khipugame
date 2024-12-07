export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }
    init(data) {
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
    }
    
    preload() {
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
    }
    
    _openWindow() {
        window.open("https://forms.gle/gW5an78GgXbbZtas9", "_blank")
    }
    
    _openInsta() {
        window.open("https://www.instagram.com/kuychiproject/", "_blank")
    }
    
    _openFace() {
        window.open("https://www.facebook.com/Kuychi-435800183533124/", "_blank")
    }

    create() {
            // create sound entities
        this.sfx = {
            jump: this.game.add.audio('sfx:jump'),
            platform: this.game.add.audio('sfx:platform'),
        };
        // create level
        this.game.add.image(0, 0, 'startgame');
        this._loadLevel(this.game.cache.getJSON('start0'));
    
        const button = this.game.add.button(855, 26, 'button', this._openWindow, this);
        button.input.useHandCursor = true;
        this.game.add.button(855, 126, 'button2', this._openInsta, this);
        this.game.add.button(855, 226, 'button3', this._openFace, this);
    }

    update() {
        this._handleCollisions();
        this._handleInput();
    }
    
    _handleCollisions() {
        this.game.physics.arcade.collide(this.hero, this.platforms);
        this.game.physics.arcade.overlap(this.hero, this.coin, this._onHeroVsCoin, null, this);
    };
    
    _handleInput() {
        if (this.keys.left.isDown) { // move hero left
            this.hero.move(-1);
        } else if (this.keys.right.isDown) { // move hero right
            this.hero.move(1);
        } else { // stop
            this.hero.move(0);
        }
    }

    _loadLevel(data) {
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
    }
    
    _spawnPlatform(platform) {
        let sprite = this.platforms.create(
            platform.x, platform.y, platform.image);
    
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
    }
    
    _spawnCoin(coin) {
        let sprite = this.coin.create(coin.x, coin.y, coin.image);
    
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
    }
    
    _spawnCharacters(data) {
        // spawn hero
        this.hero = new Hero(this.game, data.hero.x, data.hero.y);
        this.game.add.existing(this.hero);
    }
    
    _onHeroVsCoin(_hero, platform) {
        this.sfx.platform.play();
        platform.kill();
        
        this.game.state.add('play', PlayState);
            this.game.state.start('play', true, false, {level: 0});
    }
    
    shutdown() {}
}