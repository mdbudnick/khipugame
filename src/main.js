window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
	game.state.add('main', MainMenuState);
	game.state.start('main', true, false, 'start0');
};