import Player from "../entity/Player";
import Ground from "../entity/Ground";
import Enemy from "../entity/Enemy";
import Gun from "../entity/Gun"
import Laser from "../entity/Laser"

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
    this.collectGun = this.collectGun.bind(this);
    this.fireLaser = this.fireLaser.bind(this);
    this.hit = this.hit.bind(this);
  }

  preload() {
    //load Sprites
    this.load.spritesheet('josh', 'assets/spriteSheets/josh.png', {
      frameWidth: 340,
      frameHeight: 460,
    })
    this.load.image('brandon', 'assets/sprites/brandon.png')
    this.load.image('ground', 'assets/sprites/ground.png');
    this.load.image('gun', 'assets/sprites/gun.png');
    this.load.image('laserBolt', 'assets/sprites/laserBolt.png');

    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('laser', 'assets/audio/laser.wav');
    this.load.audio('scream', 'assets/audio/scream.wav');
  }

  create() {
    // Create game entities
    this.createGroups();

    //Josh, the player
    this.player = new Player(this, 20, 400, 'josh').setScale(0.25);

    //Brandon,the enemy.
    this.enemy = new Enemy(this, 600, 400, 'brandon').setScale(.25);

    //the gun
    this.gun = new Gun(this, 300, 400, 'gun').setScale(0.25);

    // Create player's animations
    this.createAnimations();

    // Create sounds
    // << CREATE SOUNDS HERE >>
    this.jumpSound = this.sound.add('jump');
    this.laserSound = this.sound.add('laser');
    this.laserSound.volume = 0.5;
    this.screamSound = this.sound.add('scream');

     // Assign the cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create collions for all entities
    this.createCollisions();
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    this.player.update(this.cursors, this.jumpSound);
    this.gun.update(
      time,
      this.player,
      this.cursors,
      this.fireLaser,
      this.laserSound
    );
    this.enemy.update(this.screamSound);
  }

  createGround(x, y) {
    this.groundGroup.create(x, y, 'ground');
  }

  // Make all the groups
  createGroups() {
    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    //add ground to group
    this.createGround(160, 540);
    this.createGround(600, 540);
    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 40,
      runChildUpdate: true,
      allowGravity: false
    });
  }

  collectGun(player, gun) {
    // << ADD GAME LOGIC HERE >>
    gun.disableBody(true, true);
    // Set the player to 'armed'
    this.player.armed = true;
  }

  // make the laser inactive and insivible when it hits the enemy
  hit(enemy, laser) {
    laser.setActive(false);
    laser.setVisible(false);
  }

  // Make collisions
  createCollisions() {
    this.physics.add.collider(this.gun, this.groundGroup);
    this.physics.add.collider(this.player, this.groundGroup);
    // Important to put the enemy-ground collision before the player-enemy
    // collision so enemy bounces slightly when you jump on his head
    this.physics.add.collider(this.enemy, this.groundGroup);
    this.physics.add.collider(this.player, this.enemy);
    this.physics.add.collider(this.lasers, this.enemy);
    // create a checker to see if the player collides with the gun
    this.physics.add.overlap(
      this.player,
      this.gun,
      this.collectGun,
      null,
      this
    );
    // create a checker to see if the laser hits the enemy
    this.physics.add.overlap(this.enemy, this.lasers, this.hit, null, this);
  }

  fireLaser(x, y, left) {
    // These are the offsets from the player's position that make it look like
    // the laser starts from the gun in the player's hand
    const offsetX = 56;
    const offsetY = 14;
    const laserX = this.player.x + (this.player.facingLeft ? -offsetX : offsetX);
    const laserY = this.player.y + offsetY;

    let laser = this.lasers.getFirstDead();
    if (!laser) {
      // Create a laser bullet and scale the sprite down
      laser = new Laser(
        this,
        laserX,
        laserY,
        'laserBolt',
        this.player.facingLeft
      ).setScale(0.25);
      this.lasers.add(laser);
    }
    // Reset this laser to be used for the shot
    laser.reset(laserX, laserY, this.player.facingLeft);
  }

  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('josh', { start: 17, end: 20 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'jump',
      frames: [{ key: 'josh', frame: 17 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'idleUnarmed',
      frames: [{ key: 'josh', frame: 11 }],
      frameRate: 10,
    });
    this.anims.create({
      key: 'idleArmed',
      frames: [{ key: 'josh', frame: 6 }],
      frameRate: 10,
    });
  }
}
