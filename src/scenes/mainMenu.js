import Phaser from "phaser";
import Hero from "../sprites/hero";
import Play from "./play";
export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenu" });
    }
    
    init(data) {
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP
        });
    }
    
    preload() {
        this.load.json('start0', 'assets/data/start0.json');
        this.load.image('startgame', 'assets/images/startgame.jpg');
        this.load.image('ground', 'assets/images/ground.png');
    
        this.load.image('grass:6x1', 'assets/images/starttile.png');
        
        this.load.image('encuesta', 'assets/images/encuesta.png');    
        this.load.image('instagram', 'assets/images/instagramlogo.png');
        this.load.image('facebook', 'assets/images/facebooklogo.png');
        
        this.load.spritesheet('hero', 'assets/images/hero.png', {
            frameWidth: 36,
            frameHeight: 42,
          });
        
        this.load.audio('sfx:jump', 'assets/audio/jump.wav');
        this.load.audio('sfx:coin', 'assets/audio/coin.wav');
    }
    
    _openForm() {
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
            jump: this.sound.add('sfx:jump'),
            coin: this.sound.add('sfx:coin'),
        };
        // create level
        this.add.image(480, 300, 'startgame');
        this._loadLevel(this.cache.json.get('start0'));
    
        this.add.image(855, 45, 'encuesta')
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', this._openForm)

        this.add.image(855, 145, 'instagram')
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', this._openInsta);

        this.add.image(855, 245, 'facebook')
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', this._openFace);
    }

    update() {
        this._handleInput();
    }
    
    _handleInput() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
            let didJump = this.hero.jump();
            if (didJump) {
                this.sfx.jump.play();
            }
        }
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
        this.platforms = this.add.group();
        this.coins = this.add.group();
        // spawn all platforms
        data.platforms.forEach(this._spawnPlatform, this);
        data.coins.forEach(this._spawnCoin, this);
        // spawn hero and enemies
        this.hero = new Hero(this, data.hero.x, data.hero.y);
        this.physics.add.collider(this.hero, this.platforms);
        this.physics.add.collider(this.hero, this.coins, this._onHeroVsCoin, null, this);
    }
    
    _spawnPlatform(platformData) {
        let platform = this.platforms.create(platformData.x, platformData.y, platformData.image);
        platform = this.physics.add.existing(platform)
        platform.body.setAllowGravity(false);
        platform.body.setImmovable(true);
    }
    
    _spawnCoin(coinData) {
        let coin = this.coins.create(coinData.x, coinData.y, coinData.image);
        this.physics.add.existing(coin).body.setAllowGravity(false);
    }
    
    _onHeroVsCoin(_hero, coin) {
        this.sfx.coin.play();
        coin.destroy();
        
        this.scene.start('Play');
    }
    
    shutdown() {}
}