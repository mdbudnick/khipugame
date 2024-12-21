export default class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "coin")
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true)
        this.body.setAllowGravity(false);
        
        this.anims.create({ key: 'rotate', defaultTextureKey: 'coin',
            frames: [
                { frame: 0 },
                { frame: 1 },
                { frame: 3 },
                { frame: 2 },
                ], 
                frameRate: 4, 
                repeat: -1 });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.update();
    }

    update() {
        this.anims.play('rotate', true);
    }
}
