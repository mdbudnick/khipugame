export default class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "coin")
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true)
        this.body.setAllowGravity(false);
        
        this.anims.create({ key: 'rotate', defaultTextureKey: 'coin',
            frames: [0,1,3,2], frameRate: 4, repeat: -1 });
        this.anims.play('rotate');
    }
}
