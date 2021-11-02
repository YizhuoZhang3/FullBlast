import 'phaser';

export default class Laser extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteKey, facingLeft) {
        super(scene, x, y, spriteKey);
        // Store reference of scene passed to constructor
        this.scene = scene;
        // Add laser to scene and enable physics
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        // Set how fast the laser travels (pixels/ms). Hard coded it here for simplicity
        this.speed = Phaser.Math.GetSpeed(800, 1); // (distance in pixels, time (ms))
        // Important to not apply gravity to the laser bolt!
        this.body.setAllowGravity(false);
         // Our reset function will take care of initializing the remaining fields
        this.reset(x, y, facingLeft)
    }

    reset(x, y, facingLeft) {
        this.setActive(true);
        this.setVisible(true);
        this.lifespan = 900;
        this.facingLeft = facingLeft
        this.setPosition(x, y)
    }

    update(time, delta) {
        this.lifespan -= delta;
        const moveDistance = this.speed * delta
        if (this.facingLeft) {
          this.x -= moveDistance
        } else {
          this.x += moveDistance
        }

        if (this.lifespan <= 0) {
          this.setActive(false);
          this.setVisible(false);
        }
    }
}