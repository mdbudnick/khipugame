export default class Spider extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "spider")
        this.SPEED = 100
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.collideWorldBounds = true;
        this.body.setAllowGravity(true);
        this.body.setCollideWorldBounds(true);
        this.setOrigin(0, 0);
        this.body.velocity.x = this.SPEED;

        
        this.anims.create({ key: 'crawl', frames: this.anims.generateFrameNumbers('spider', {
            frames: [0,1,2]
          }), frameRate: 8, repeat: -1});
        this.anims.create({ key: 'die', frames: this.anims.generateFrameNumbers('spider', {
            frames: [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3]
          }), frameRate: 8 });
        this.anims.play('crawl');
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.update();
    }

    update() {
        // check against walls and reverse direction if necessary
        if (this.body.touching.right || this.body.blocked.right) {
            this.body.velocity.x = -this.SPEED; // turn left
        } else if (this.body.touching.left || this.body.blocked.left) {
            this.body.velocity.x = this.SPEED; // turn right
        }
    }
    
    die() {
        this.body.enable = false;
        this.anims.play('die');
        setTimeout(() =>{
            this.destroy()
        }, 1000);
    }
}
