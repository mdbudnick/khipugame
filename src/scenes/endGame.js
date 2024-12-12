import Hero from '../sprites/hero'
export default class EndGame extends Phaser.Scene {
    constructor() {
        super({ key: "EndGame" });
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
        this.game.load.json('start0', 'assets/data/start0.json');
        this.game.load.image('endgame', 'assets/images/endgame.jpg');
        this.game.load.image('ground', 'assets/images/ground.png');
        
        this.game.load.image('button', 'assets/images/encuesta.png');
        this.game.load.image('button1', 'assets/images/restarttile.png');
        
        this.game.load.spritesheet('hero', 'assets/images/hero.png', 36, 42);
        
        this.game.load.audio('sfx:jump', 'assets/audio/jump.wav');
        this.game.load.audio('sfx:platform', 'assets/audio/coin.wav');
    }

    openWindow() {
        window.open("https://forms.gle/gW5an78GgXbbZtas9", "_blank")
    }
    
    restartGame() {
        this.game.state.start('main', true, false, 'start0');
    }

    create() {
        // create sound entities
        this.sfx = {
            jump: this.game.add.audio('sfx:jump'),
        };
        // create level
        this.game.add.image(0, 0, 'endgame');
        this._loadLevel(this.game.cache.getJSON('start0'));
    
        this.game.add.button(450, 240, 'button', openWindow, this);
        buttonWeb.input.useHandCursor = true;
        this.game.add.button(400, 340, 'button1', restartGame, this);
    }

    update() {
        this._handleCollisions();
        this._handleInput();
    }

    _handleCollisions() {
        this.game.physics.arcade.collide(this.hero, this.platforms);
     };
     
     _handleInput() {
         if (this.keys.left.isDown) { // move hero left
             this.hero.move(-1);
         } else if (this.keys.right.isDown) { // move hero right
             this.hero.move(1);
         } else {
             this.hero.move(0);
         }
     };
     
     _loadLevel(data) {
         // create all the groups/layers that we need
         this.platforms = this.game.add.group();
         // spawn all platforms
         data.platforms.forEach(this._spawnPlatform, this);
         // spawn hero and enemies
         this._spawnCharacters({hero: data.hero});
     };
     
     _spawnPlatform(platform) {
         let sprite = this.platforms.create(
             platform.x, platform.y, platform.image);
     
         this.game.physics.enable(sprite);
         sprite.body.allowGravity = false;
         sprite.body.immovable = true;
     };
     
     _spawnCoin(coin) {
         let sprite = this.coin.create(
             coin.x, coin.y, coin.image);
     
         this.game.physics.enable(sprite);
         sprite.body.allowGravity = false;
         sprite.body.immovable = true;
     };
     
     _spawnCharacters(data) {
         // spawn hero
         this.hero = new Hero(this.game, data.hero.x, data.hero.y);
         this.game.add.existing(this.hero);
     };
     
     shutdown() {};
}