var ScreenDraw = new function ()
{
	this.draw2D = null;
	this.setDraw2D = function (draw2D)
	{
		this.draw2D = draw2D;
	};

	this.pause = function ()
	{
		var viewPort = this.draw2D.getViewport();
		Drawing.drawShadowOverlay(viewPort, Config.game.stageWidth, Config.game.stageHeight);

		FontDrawing.start();
		FontDrawing.segmentText(viewPort[0] + 5, viewPort[1] + 5, "Paused", 10, 0.7);
	};


	this.gameOver = function (score)
	{
		var viewPort = this.draw2D.getViewport();
		Drawing.drawShadowOverlay(viewPort, Config.game.stageWidth, Config.game.stageHeight);

		FontDrawing.start(); 
		FontDrawing.segmentText(viewPort[0] + 5, viewPort[1] + 5, "Game Over \nScore:" + score + "\n \npress 'space' to play again", 10, 0.7);
	};

	this.welcome = function ()
	{
		var viewPort = this.draw2D.getViewport();
		Drawing.drawShadowOverlay(viewPort, Config.game.stageWidth, Config.game.stageHeight);

		FontDrawing.start();
		FontDrawing.segmentText(viewPort[0] + 5, viewPort[1] + 5, "Welcome to the game! \n\nPress 'space' to clutch or release", 10, 0.7);
	};
};