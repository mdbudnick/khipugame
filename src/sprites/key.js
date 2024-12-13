export default class Key extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true)
        this.body.setAllowGravity(false);
    
    }
}
