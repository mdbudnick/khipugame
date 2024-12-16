import Phaser from "phaser";
import MainMenu from "./scenes/mainMenu";
import Play from "./scenes/play";
import EndGame from "./scenes/endGame";

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
		debug: true,
	  },
	},
	scene: [Play, MainMenu, EndGame],
  };
  
const game = new Phaser.Game(config);