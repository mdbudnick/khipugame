export default class Hero extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'hero')
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.collideWorldBounds = true;
        this.body.setAllowGravity(true);
        this.setOrigin(0.5, 0.5);
        this.body.setCollideWorldBounds = true;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.anims.create({ key: 'stop', frames: this.anims.generateFrameNumbers('hero', {
            start: 0,
            end: 0,
          })})
        this.anims.create({ key: 'run', defaultTextureKey: 'hero',
            frames: [
              { frame: 1, duration: 100 },
              { frame: 2, duration: 100 },
            ], repeat: -1})
          this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('hero', {
            frames: [4]
          })})
          this.anims.create({ key: 'fall', frames: this.anims.generateFrameNumbers('hero', {
            frames: [3]
          })})
    }

    preUpdate() {
        super.preUpdate()
        this.update()
    }

    move(direction) {
        const SPEED = 200;
        this.body.setVelocityX(direction * SPEED); // Set horizontal velocity
    
        // Flip sprite based on movement direction
        if (this.body.velocity.x < 0) {
            this.setFlipX(true); // Flip sprite to face left
        } else if (this.body.velocity.x > 0) {
            this.setFlipX(false); // Default to facing right
        }
    }

    jump() {
        const JUMP_SPEED = 600;
    
        // Check if the Hero is standing on something
        let canJump = this.body.blocked.down || this.body.touching.down;
    
        if (canJump) {
            this.body.setVelocityY(-JUMP_SPEED); // Apply upward velocity
        }
    
        return canJump;
    }

    bounce() {
        const BOUNCE_SPEED = 200;
        this.body.velocity.y = -BOUNCE_SPEED;
    }

    update() {
        super.update()
        // update sprite animation, if it needs changing
        let animationName = this._getAnimationName();
        if (this.anims.getName() !== animationName) {
            this.anims.play(animationName);
        }
    }

    _getAnimationName = function () {
        let name = 'stop'; // default animation
    
        // jumping
        if (this.body.velocity.y < 0) {
            name = 'jump';
        }
        // falling
        else if (this.body.velocity.y > 0 && !this.body.touching.down) {
            name = 'fall';
        }
        else if (this.body.velocity.x !== 0 && this.body.touching.down) {
            name = 'run';
        }
    
        return name;
    }
}