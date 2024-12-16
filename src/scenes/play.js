import Coin from "../sprites/coin";
import Door from "../sprites/door";
import Hero from "../sprites/hero";
import Key from "../sprites/key";
import Spider from "../sprites/spider";
export default class Play extends Phaser.Scene {

    constructor() {
        super({ key: "Play" });
        this.LEVEL_COUNT = 4;
    }

    init(data) {
        this.coinPickupCount = 0;
    
        this.hasKeys = 0;
        this.level = (data.level || 0);
    }
    
    preload() {
        this.load.json('level:0', 'assets/data/level00.json');
        this.load.json('level:1', 'assets/data/level01.json');
        this.load.json('level:2', 'assets/data/level02.json');
        this.load.json('level:3', 'assets/data/level03.json');
    
        this.load.image('font:numbers', 'assets/images/numbers.png');
    
        this.load.image('background', 'assets/images/background.png');
        
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('grass:8x1', 'assets/images/grass_8x1.png');
        this.load.image('grass:6x1', 'assets/images/grass_6x1.png');
        this.load.image('grass:4x1', 'assets/images/grass_4x1.png');
        this.load.image('grass:2x1', 'assets/images/grass_2x1.png');
        this.load.image('grass:1x1', 'assets/images/grass_1x1.png');
        this.load.image('invisible-wall', 'assets/images/invisible_wall.png');
        this.load.image('icon:coin', 'assets/images/coin_icon.png');
        
        this.load.spritesheet('key', 'assets/images/key01.png', {
            frameWidth: 60,
            frameHeight: 30,
          });
        this.load.spritesheet('badkey', 'assets/images/badkey01.png',{
            frameWidth: 60,
            frameHeight: 30,
          });
    
        this.load.spritesheet('coin', 'assets/images/coin_animated.png',{
            frameWidth: 22,
            frameHeight: 22,
          });
        this.load.spritesheet('spider', 'assets/images/spider.png',{
            frameWidth: 43,
            frameHeight: 32,
          });
        this.load.spritesheet('hero', 'assets/images/hero.png',{
            frameWidth: 36,
            frameHeight: 42,
          });
        this.load.spritesheet('door', 'assets/images/door.png',{
            frameWidth: 42,
            frameHeight: 66,
          });
        this.load.spritesheet('icon:key', 'assets/images/key_icon.png',{
            frameWidth: 34,
            frameHeight: 30,
          });
    
        this.load.audio('sfx:jump', 'assets/audio/jump.wav');
        this.load.audio('sfx:coin', 'assets/audio/coin.wav');
        this.load.audio('sfx:stomp', 'assets/audio/stomp.wav');
        this.load.audio('sfx:key', 'assets/audio/key.wav');
        this.load.audio('sfx:door', 'assets/audio/door.wav');
        this.load.audio('sfx:bgm', ['assets/audio/bgm.mp3', 'assets/audio/bgm.ogg']);
    }
    
    create() {
        this.keyNum = this.cache.json.get(`level:${this.level}`).keyz.length;
        
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP
        });
        // create sound entities
        this.sfx = {
            jump: this.sound.add('sfx:jump'),
            coin: this.sound.add('sfx:coin'),
            stomp: this.sound.add('sfx:stomp'),
            key: this.sound.add('sfx:key'),
            door: this.sound.add('sfx:door'),
            bgm: this.sound.add('sfx:bgm')
        };
        if (!this.sfx.bgm.isPlaying) {
            this.sfx.bgm.setLoop(true);
            this.sfx.bgm.play()
        }
        // create level
        this.add.image(480, 300, 'background');
        this._loadLevel(this.cache.json.get(`level:${this.level}`));
        this._createHud();
        this._handleCollisions();
    }
    
    update() {
        this._handleInput()
        this.coinText.setText(`X${this.coinPickupCount}`);
        this.keyText.setText(`X${this.hasKeys}`);
    
        if (this.hasKeys === this.keyNum) {
            this.door.setFrame(1);
        }
    
        this.coinsInLevel = this.cache.json.get(`level:${this.level}`).coins.length;
        if (this.coinPickupCount === this.coinsInLevel){
            this._revealClues();
        };   
    }

    shutdown() {
        this.sfx.bgm.stop();
    }
    
    _revealClues() {	
        this.badkeyz.children.entries.forEach( (k) => { k.destroy() } );
    }
    
    _handleCollisions() {
        this.physics.add.collider(this.spiders, this.platforms);
        this.physics.add.collider(this.spiders, this.enemyWalls);
        this.physics.add.collider(this.hero, this.platforms);
        this.physics.add.collider(this.hero, this.spiders, this._onHeroVsEnemy, null, this);

        this.physics.add.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this);
        this.physics.add.overlap(this.hero, this.keyz, this._onHeroVsKey, null, this);
        this.physics.add.overlap(this.hero, this.badkeyz, this._onHeroVsBadKey, null, this);
        
        this.physics.add.collider(this.hero, this.door, this._onHeroVsDoor,
            // ignore if there is no key or the player is on air
            function (hero, door) {
                return this.hasKeys === this.keyNum && hero.body.touching.down;
            }, this);
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
        this.door = new Door(this, data.door.x, data.door.y);
        this.platforms = this.add.group();
        this.coins = this.add.group();
        this.spiders = this.add.group();
        this.enemyWalls = this.add.group();
        this.enemyWalls.visible = false;    
        this.keyz = this.add.group();
        this.badkeyz = this.add.group();
    
        // spawn all platforms
        data.platforms.forEach(this._spawnPlatform, this);
        // spawn hero and enemies
        this._spawnCharacters({hero: data.hero, spiders: data.spiders});
        // spawn important objects
        data.coins.forEach(this._spawnCoin, this);
        //this._spawnKey(data.key.x, data.key.y, data.key.frame);
        data.keyz.forEach(this._spawnKey, this);
        // add a small 'up & down' animation via a tween for keyz
        this.tweens.add({
            targets: this.keyz,
            y: this.keyz.y + 6,
            duration: 800,
            ease: 'Sine.easeInOut', // Phaser 3 uses string identifiers for ease functions
            yoyo: true,
            repeat: -1 // use -1 for infinite loop
        });

        data.badkeyz.forEach(this._spawnBadKey, this);
        // add a small 'up & down' animation via a tween for badkeyz
        this.tweens.add({
            targets: this.badkeyz,
            y: this.badkeyz.y + 6,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
    
    _spawnPlatform(platformData) {
        let platform = this.platforms.create(platformData.x, platformData.y, platformData.image);
        platform = this.physics.add.existing(platform)
        platform.body.setAllowGravity(false);
        platform.body.setImmovable(true);
        platform.setOrigin(0,0)
    
        this._spawnEnemyWall(platformData.x - 5, platformData.y - 20, 'left');
        this._spawnEnemyWall(platformData.x + platform.width + 5, platformData.y - 20, 'right');
    }
    
    _spawnEnemyWall(x, y, side) {
        let wall = this.enemyWalls.create(x, y, 'invisible-wall');
        // anchor and y displacement
        // physic properties
        this.physics.add.existing(wall);
        wall.body.setImmovable(true);
        wall.body.setAllowGravity(false);
        wall.visible = false;
    }
    
    _spawnCharacters(data) {
        data.spiders.forEach(function (spider) {
            this.spiders.add(new Spider(this, spider.x, spider.y));
        }, this);
        this.hero = new Hero(this, data.hero.x, data.hero.y);
    }
    
    _spawnCoin(coin) {
        this.coins.add(new Coin(this, coin.x, coin.y))
    }
    
    _spawnKey(key) {
        this.keyz.add(new Key(this, key.x, key.y, 'key', key.frame));
    }
    
    _spawnBadKey(bkey) {
        this.badkeyz.add(new Key(this, bkey.x, bkey.y, 'badkey', bkey.frame))
    }
    
    _onHeroVsCoin(hero, coin) {
        this.sfx.coin.play();
        coin.destroy();
        this.coinPickupCount++;
    }
    
    _onHeroVsEnemy(hero, enemy) {
        if (hero.y + 35 < enemy.y) { // destroy enemies when hero is falling from above
            hero.bounce();
            enemy.die();
            this.sfx.stomp.play();
        }
        else { // game over -> restart the game
            this.sfx.stomp.play();
            this._restartLevel()
        }
    }

    _restartLevel() {
        this.sfx.bgm.stop()
        this.scene.restart({ level: this.level });
    }
    
    _onHeroVsKey(hero, key) {
        this.sfx.key.play();
        key.destroy();
        this.hasKeys++;
    }
    
    _onHeroVsBadKey(hero, bkey) {
        this.sfx.stomp.play();
        bkey.destroy();
        this._restartLevel();
    }
    
    _onHeroVsDoor(hero, door) {
        this.sfx.door.play();
        if (this.level === this.LEVEL_COUNT) {
            this.scene.start('EndGame');
        } else {
            this.level++
            this._restartLevel();
        }
    }
    
    _createHud() {
        var numbersFontConfig = {
            // image
            image: 'font:numbers',
            offset: {
                x: 0,
                y: 0
            },
            // characters
            width: 20,
            height: 26,
            chars: '0123456789X ',
            charsPerRow: 6,
            // spacing
            spacing: {
                x: 0,
                y: 0
            },
            lineSpacing: 0
        }
        this.cache.bitmapFont.add('numbersFont', Phaser.GameObjects.RetroFont.Parse(this, numbersFontConfig));
        this.coinIcon = this.make.image({ x: 25, y: 27, key: 'icon:coin' });
        this.coinText = this.add.bitmapText(50, 15, 'numbersFont', 'X0');
        this.keyIcon = this.make.sprite({ x: 25, y: 75, key: 'icon:key' });
        this.keyText = this.add.bitmapText(50, 60, 'numbersFont', 'X0');
    }
}