import Coin from "../sprites/coin";
import Hero from "../sprites/hero";
import Key from "../sprites/key";
import Spider from "../sprites/spider";
export default class Play extends Phaser.Scene {

    constructor() {
        super({ key: "play" });
        this.LEVEL_COUNT = 4;
    }

    init(data) {
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP
        });
        
        this.coinPickupCount = 0;
    
        this.hasKey = 0;
        this.level = (data.level || 0) % this.LEVEL_COUNT;
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
        // create sound entities
        this.sfx = {
            jump: this.sound.add('sfx:jump'),
            coin: this.sound.add('sfx:coin'),
            stomp: this.sound.add('sfx:stomp'),
            key: this.sound.add('sfx:key'),
            door: this.sound.add('sfx:door'),
            bgm: this.sound.add('sfx:bgm')
        };
        this.sfx.bgm.setLoop(true);
        this.sfx.bgm.play()
        // create level
        this.add.image(480, 300, 'background');
        this._loadLevel(this.cache.json.get(`level:${this.level}`));
    
        // crete hud with scoreboards
        this._createHud();
    }
    
    update() {
        this._handleCollisions();
        this._handleInput();
    
        this.coinFont.text = `x${this.coinPickupCount}`;
        
        this.keyFont.text = `x${this.hasKey}`;
        this.keyNum = this.cache.getJSON(`level:${this.level}`).keyz.length;
        this.keyIcon.frame = this.hasKey === this.keyNum ? 1 : 0;
    
        if (this.hasKey === this.keyNum) {
            this.door.frame = 1;
        }
    
        this.coinsInLevel = this.cache.getJSON(`level:${this.level}`).coins.length;
        if (this.coinPickupCount === this.coinsInLevel){
            this._revealClues();
        };   
    }

    shutdown() {
        this.sfx.bgm.stop();
    }
    
    _revealClues() {	
        this.badkeyz.destroy();
    }
    
    _handleCollisions() {
        this.physics.arcade.collide(this.spiders, this.platforms);
        this.physics.arcade.collide(this.spiders, this.enemyWalls);
        this.physics.arcade.collide(this.hero, this.platforms);
    
        this.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
            null, this);
        this.physics.arcade.overlap(this.hero, this.spiders,
            this._onHeroVsEnemy, null, this);
        this.physics.arcade.overlap(this.hero, this.keyz, this._onHeroVsKey,
            null, this);
            
        this.physics.arcade.overlap(this.hero, this.badkeyz, this._onHeroVsBadKey,
            null, this);
        
        this.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
            // ignore if there is no key or the player is on air
            function (hero, door) {
                return this.hasKey === this.keyNum && hero.body.touching.down;
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
        this.bgDecoration = this.add.group();
        this.platforms = this.add.group();
        this.coins = this.add.group();
        this.spiders = this.add.group();
        this.enemyWalls = this.add.group();
        this.enemyWalls.visible = false;
        
        this.keyz = this.add.group();
        this.badkeyz = this.add.group();
    
        this._spawnDoor(data.door.x, data.door.y);
        // spawn all platforms
        data.platforms.forEach(this._spawnPlatform, this);
        // spawn hero and enemies
        this._spawnCharacters({hero: data.hero, spiders: data.spiders});
        // spawn important objects
        data.coins.forEach(this._spawnCoin, this);
        this.physics.add.collider(this.hero, this.platforms);
        this.physics.add.collider(this.hero, this.coins, this._onHeroVsCoin, null, this);
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
    
        this._spawnEnemyWall(platformData.x - (platform.width / 2), platformData.y - platform.height, 'left');
        this._spawnEnemyWall(platformData.x + (platform.width / 2), platformData.y - platform.height, 'right');
    }
    
    _spawnEnemyWall(x, y, side) {
        let wall = this.enemyWalls.create(x, y, 'invisible-wall');
        // anchor and y displacement
        // physic properties
        this.physics.add.existing(wall);
        wall.body.setImmovable(true);
        wall.body.setAllowGravity(false);
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
    
    _spawnDoor(x, y) {
        this.door = this.bgDecoration.create(x, y, 'door');
    }
    
    _spawnKey(key) {
        this.keyz.add(new Key(this, key.x, key.y, 'key', key.frame));
    }
    
    _spawnBadKey(bkey) {
        this.badkeyz.add(new Key(this, bkey.x, bkey.y, 'badkey', bkey.frame))
    }
    
    _onHeroVsCoin(hero, coin) {
        this.sfx.coin.play();
        coin.kill();
        this.coinPickupCount++;
    }
    
    _onHeroVsEnemy(hero, enemy) {
        if (hero.body.velocity.y > 0) { // kill enemies when hero is falling
            hero.bounce();
            enemy.die();
            this.sfx.stomp.play();
        }
        else { // game over -> restart the game
            this.sfx.stomp.play();
            this.state.restart(true, false, {level: this.level});
        }
    }
    
    _onHeroVsKey(hero, key) {
        this.sfx.key.play();
        key.kill();
        this.hasKey++;
    }
    
    _onHeroVsBadKey(hero, bkey) {
        this.sfx.stomp.play();
        bkey.kill();
        this.state.restart(true, false, {level: this.level});
    }
    
    _onHeroVsDoor(hero, door) {
        this.sfx.door.play();
        if (this.level === 3) {
            this.state.add('end', EndGameState);
            this.state.start('end', true, false, 'start0');
        } else {
            this.state.restart(true, false, { level: this.level + 1 });
        }
    }
    
    _createHud() {
        const NUMBERS_STR = '0123456789X ';
        this.coinFont = this.add.retroFont('font:numbers', 20, 26,
            NUMBERS_STR, 6);
        
        let coinIcon = this.make.image(0, 59, 'icon:coin');
        let coinScoreImg = this.make.image(coinIcon.x + coinIcon.width,
            coinIcon.y + coinIcon.height / 2, this.coinFont);
        coinScoreImg.anchor.set(0, 0.5);
        
        this.keyFont = this.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6);
        this.keyIcon = this.make.sprite(0, 19, 'icon:key');
        let keyScoreImg = this.make.image(this.keyIcon.x + coinIcon.width,
            this.keyIcon.y + this.keyIcon.height / 2, this.keyFont);
            keyScoreImg.anchor.set(0, 0.5);
    
        this.hud = this.add.group();
        this.hud.add(coinIcon);
        this.hud.add(coinScoreImg);
        this.hud.add(this.keyIcon);
        this.hud.add(keyScoreImg);
        
        this.hud.position.set(10, 10);	
    }
}