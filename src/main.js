import Phaser from "phaser";
import MainMenu from "./scenes/main-menu";
import Play from "./scenes/play";
import EndGame from "./scenes/end-game";

const config = {
	width: 960,
	height: 600,
	scale: {
	  autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	autoRound: false,
	parent: "game-container",
	physics: {
	  default: "arcade",
	  arcade: {
		gravity: { y: 1200 },
	  },
	},
	scene: [MainMenu, Play, EndGame],
  };
  
const game = new Phaser.Game(config);