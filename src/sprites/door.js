export default class Door extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "door")
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setImmovable(true)
        this.body.setAllowGravity(false);
    }
}
