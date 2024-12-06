function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.khipu.anchor.set(0.5, 0.5);

    // physic properties
    this.khipu.game.physics.enable(this);
    this.khipu.body.collideWorldBounds = true;

    this.khipu.animations.add('stop', [0]);
    this.khipu.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.khipu.animations.add('jump', [3]);
    this.khipu.animations.add('fall', [4]);

}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.khipu.body.velocity.x = direction * SPEED;

    // update image flipping & animations
    if (this.khipu.body.velocity.x < 0) {
        this.khipu.scale.x = -1;
    }
    else if (this.khipu.body.velocity.x > 0) {
        this.khipu.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.khipu.body.touching.down;

    if (canJump) {
        this.khipu.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};

Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.khipu.body.velocity.y = -BOUNCE_SPEED;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this.khipu._getAnimationName();
    if (this.khipu.animations.name !== animationName) {
        this.khipu.animations.play(animationName);
    }
};

Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // jumping
    if (this.khipu.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.khipu.body.velocity.y >= 0 && !this.khipu.body.touching.down) {
        name = 'fall';
    }
    else if (this.khipu.body.velocity.x !== 0 && this.khipu.body.touching.down) {
        name = 'run';
    }

    return name;
};