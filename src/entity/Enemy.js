import 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteKey) {
      super(scene, x, y, spriteKey);

      // << INITIALIZE PLAYER ATTRIBUTES HERE >>
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.world.enable(this);

      this.flipX = !this.flipX;
      this.playedSound = false;
    }

    update(screamSound) {
        if (this.y > 600 && !this.playedSound) {
          this.playedSound = true;
          screamSound.play();
        }
    }
}