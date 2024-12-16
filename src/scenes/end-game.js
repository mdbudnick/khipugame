import Hero from '../sprites/hero'

export default class EndGame extends Phaser.Scene {
    constructor() {
        super({ key: "EndGame" });
    }

    preload() {
        this.load.json('start0', 'assets/data/start0.json');
        this.load.image('endgame', 'assets/images/endgame.jpg');
        this.load.image('ground', 'assets/images/ground.png');
        
        this.load.image('encuesta', 'assets/images/encuesta.png');
        this.load.image('restart', 'assets/images/restarttile.png');
        
        this.load.spritesheet('hero', 'assets/images/hero.png', {
            frameWidth: 36,
            frameHeight: 42,
          });
        
        this.load.audio('sfx:jump', 'assets/audio/jump.wav');
    }

    _openForm() {
        window.open("https://forms.gle/gW5an78GgXbbZtas9", "_blank")
    }
    
    _restartGame() {
        this.scene.start('MainMenu');
    }

    create() {
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP
        });

        // create sound entities
        this.sfx = {
            jump: this.sound.add('sfx:jump'),
        };
        // create level
        this.add.image(480, 300, 'endgame');
    
        this.add.image(480, 275, 'encuesta')
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', this._openForm)

        this.add.image(480, 350, 'restart')
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', this._restartGame, this)

        this.hero = new Hero(this, 20, 520);
    }

    update() {
        this._handleCollisions();
        this._handleInput();
    }

    _handleCollisions() {
        this.physics.add.collider(this.hero, this.platforms);
     };
     
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
     
     shutdown() {};
}