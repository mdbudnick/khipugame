const config = {
	width: 960,
	height: 600,
	scale: {
	  mode: Phaser.Scale.FIT,
	  autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	autoRound: false,
	parent: "game-container",
	physics: {
	  default: "arcade",
	  arcade: {
		gravity: { y: 1200 },
		debug: true,
	  },
	},
	scene: [],
  };
  
const game = new Phaser.Game(config);