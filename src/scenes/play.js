import Hero from "../sprites/hero";
import Spider from "../sprites/spider";
export default class Play extends Phaser.Scene {
    LEVEL_COUNT = 4;

    constructor() {
        super({ key: "play" });
    }

    init(data) {
        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT,
            up: Phaser.KeyCode.UP
        });
        
        this.coinPickupCount = 0;
    
        this.keys.up.onDown.add(function () {
            let didJump = this.hero.jump();
            if (didJump) {
                this.sfx.jump.play();
            }
        }, this);
    
        this.hasKey = 0;
        this.level = (data.level || 0) % LEVEL_COUNT;
    }
    
    preload() {
        this.game.load.json('level:0', 'data/level00.json');
        this.game.load.json('level:1', 'data/level01.json');
        this.game.load.json('level:2', 'data/level02.json');
        this.game.load.json('level:3', 'data/level03.json');
    
        this.game.load.image('font:numbers', 'assets/images/numbers.png');
    
        this.game.load.image('background', 'assets/images/background.png');
        
        this.game.load.image('startgame', 'assets/images/startgame.png');
        this.game.load.image('endgame', 'assets/images/endgame.png');
        
        this.game.load.image('ground', 'assets/images/ground.png');
        this.game.load.image('grass:8x1', 'assets/images/grass_8x1.png');
        this.game.load.image('grass:6x1', 'assets/images/grass_6x1.png');
        this.game.load.image('grass:4x1', 'assets/images/grass_4x1.png');
        this.game.load.image('grass:2x1', 'assets/images/grass_2x1.png');
        this.game.load.image('grass:1x1', 'assets/images/grass_1x1.png');
        this.game.load.image('invisible-wall', 'assets/images/invisible_wall.png');
        this.game.load.image('icon:coin', 'assets/images/coin_icon.png');
        
        this.game.load.spritesheet('key', 'assets/images/key01.png', 60, 30);
        this.game.load.spritesheet('badkey', 'assets/images/badkey01.png', 60, 30);
    
        this.game.load.spritesheet('coin', 'assets/images/coin_animated.png', 22, 22);
        this.game.load.spritesheet('spider', 'assets/images/spider.png', 43, 32);
        this.game.load.spritesheet('hero', 'assets/images/hero.png', 36, 42);
        this.game.load.spritesheet('door', 'assets/images/door.png', 42, 66);
        this.game.load.spritesheet('icon:key', 'assets/images/key_icon.png', 34, 30);
    
        this.game.load.audio('sfx:jump', 'assets/audio/jump.wav');
        this.game.load.audio('sfx:coin', 'assets/audio/coin.wav');
        this.game.load.audio('sfx:stomp', 'assets/audio/stomp.wav');
        this.game.load.audio('sfx:key', 'assets/audio/key.wav');
        this.game.load.audio('sfx:door', 'assets/audio/door.wav');
        this.game.load.audio('sfx:bgm', ['assets/audio/bgm.mp3', 'assets/audio/bgm.ogg']);
    }
    
    create() {
        // create sound entities
        this.sfx = {
            jump: this.game.add.audio('sfx:jump'),
            coin: this.game.add.audio('sfx:coin'),
            stomp: this.game.add.audio('sfx:stomp'),
            key: this.game.add.audio('sfx:key'),
            door: this.game.add.audio('sfx:door'),
            bgm: this.game.add.audio('sfx:bgm')
        };
    this.sfx.bgm.loopFull();
        // create level
        this.game.add.image(0, 0, 'background');
        this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));
    
        // crete hud with scoreboards)
        this._createHud();
    }
    
    update() {
        this._handleCollisions();
        this._handleInput();
    
        this.coinFont.text = `x${this.coinPickupCount}`;
        
        this.keyFont.text = `x${this.hasKey}`;
        this.keyNum = this.game.cache.getJSON(`level:${this.level}`).keyz.length;
        this.keyIcon.frame = this.hasKey === this.keyNum ? 1 : 0;
    
        if (this.hasKey === this.keyNum) {
            this.door.frame = 1;
        }
    
        this.coinsInLevel = this.game.cache.getJSON(`level:${this.level}`).coins.length;
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
        this.game.physics.arcade.collide(this.spiders, this.platforms);
        this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
        this.game.physics.arcade.collide(this.hero, this.platforms);
    
        this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
            null, this);
        this.game.physics.arcade.overlap(this.hero, this.spiders,
            this._onHeroVsEnemy, null, this);
        this.game.physics.arcade.overlap(this.hero, this.keyz, this._onHeroVsKey,
            null, this);
            
        this.game.physics.arcade.overlap(this.hero, this.badkeyz, this._onHeroVsBadKey,
            null, this);
        
        this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
            // ignore if there is no key or the player is on air
            function (hero, door) {
                return this.hasKey === this.keyNum && hero.body.touching.down;
            }, this);
    }
    
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
        this.bgDecoration = this.game.add.group();
        this.platforms = this.game.add.group();
        this.coins = this.game.add.group();
        this.spiders = this.game.add.group();
        this.enemyWalls = this.game.add.group();
        this.enemyWalls.visible = false;
        
        this.keyz = this.game.add.group();
        this.badkeyz = this.game.add.group();
    
        // spawn all platforms
        data.platforms.forEach(this._spawnPlatform, this);
        // spawn hero and enemies
        this._spawnCharacters({hero: data.hero, spiders: data.spiders});
        // spawn important objects
        data.coins.forEach(this._spawnCoin, this);
        this._spawnDoor(data.door.x, data.door.y);
        //this._spawnKey(data.key.x, data.key.y, data.key.frame);
        data.keyz.forEach(this._spawnKey, this);
        
        data.badkeyz.forEach(this._spawnBadKey, this);
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
    
        this._spawnEnemyWall(platform.x, platform.y, 'left');
        this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
    }
    
    _spawnEnemyWall(x, y, side) {
        let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
        // anchor and y displacement
        sprite.anchor.set(side === 'left' ? 1 : 0, 1);
        // physic properties
        this.game.physics.enable(sprite);
        sprite.body.immovable = true;
        sprite.body.allowGravity = false;
    }
    
    _spawnCharacters(data) {
        // spawn spiders
        data.spiders.forEach(function (spider) {
            let sprite = new Spider(this.game, spider.x, spider.y);
            this.spiders.add(sprite);
        }, this);
        // spawn hero
        this.hero = new Hero(this.game, data.hero.x, data.hero.y);
        this.game.add.existing(this.hero);
    }
    
    _spawnCoin(coin) {
        let sprite = this.coins.create(coin.x, coin.y, 'coin');
        sprite.anchor.set(0.5, 0.5);
    
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
    
        sprite.animations.add('rotate', [0, 1, 3, 2], 4, true); // 6fps, looped //[0, 1, 2, 1, 0]
        sprite.animations.play('rotate');
    }
    
    _spawnDoor(x, y) {
        this.door = this.bgDecoration.create(x, y, 'door');
        this.door.anchor.setTo(0.5, 1);
        this.game.physics.enable(this.door);
        this.door.body.allowGravity = false;
    }
    
    _spawnKey(key) {
        let sprite = this.keyz.create(
            key.x, key.y, 'key', key.frame);
    
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
        sprite.anchor.set(0.5, 0.5);
        // add a small 'up & down' animation via a tween
        this.keyz.y -= 3;
        this.game.add.tween(this.keyz)
            .to({y: this.keyz.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
            .yoyo(true)
            .loop()
            .start();
    }
    
    _spawnBadKey(bkey) {
        let sprite = this.badkeyz.create(
            bkey.x, bkey.y, 'badkey', bkey.frame)
            //bkey.x + Math.floor(Math.random() * 101) , bkey.y + Math.floor(Math.random() * 101), 'key');
    
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
        sprite.body.immovable = true;
    
        sprite.anchor.set(0.5, 0.5);
     
       this.badkeyz.y -= 3;
       this.game.add.tween(this.badkeyz)
            .to({y: this.badkeyz.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
            .yoyo(true)
            .loop()
            .start();
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
            this.game.state.restart(true, false, {level: this.level});
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
        this.game.state.restart(true, false, {level: this.level});
    }
    
    _onHeroVsDoor(hero, door) {
        this.sfx.door.play();
        if (this.level === 3) {
            this.game.state.add('end', EndGameState);
            this.game.state.start('end', true, false, 'start0');
        } else {
            this.game.state.restart(true, false, { level: this.level + 1 });
        }
    }
    
    _createHud() {
        const NUMBERS_STR = '0123456789X ';
        this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
            NUMBERS_STR, 6);
        
        let coinIcon = this.game.make.image(0, 59, 'icon:coin');
        let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
            coinIcon.y + coinIcon.height / 2, this.coinFont);
        coinScoreImg.anchor.set(0, 0.5);
        
        this.keyFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6);
        this.keyIcon = this.game.make.sprite(0, 19, 'icon:key');
        let keyScoreImg = this.game.make.image(this.keyIcon.x + coinIcon.width,
            this.keyIcon.y + this.keyIcon.height / 2, this.keyFont);
            keyScoreImg.anchor.set(0, 0.5);
    
        this.hud = this.game.add.group();
        this.hud.add(coinIcon);
        this.hud.add(coinScoreImg);
        this.hud.add(this.keyIcon);
        this.hud.add(keyScoreImg);
        
        this.hud.position.set(10, 10);	
    }
}