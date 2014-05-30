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
		Drawing.drawShadowOverlay(viewPort, Config.general.stageWidth, Config.general.stageHeight);

		FontDrawing.segmentTextWithShadow("Paused", {
			x: Config.general.stageWidth / 2,
			y: viewPort[1] + Config.general.stageHeight*.5, 
			height: 10, 
			scale: 1,
			color: Config.colors.font.regular,
			alignment: 1
		});
	};


	this.gameOver = function (score, highscore)
	{
		var viewPort = this.draw2D.getViewport();
		Drawing.drawShadowOverlay(viewPort, Config.general.stageWidth, Config.general.stageHeight);

		FontDrawing.segmentTextWithShadow("Game Over",
			{
				x: Config.general.stageWidth / 2,
				y: viewPort[1] + Config.general.stageWidth * .1,
				height: 10,
				scale: 1.7,
				color: Config.colors.font.info,
				alignment: 1
			});

		FontDrawing.segmentTextWithShadow("Score: " + score,
			{
				x: Config.general.stageWidth / 2,
				y: viewPort[1] + Config.general.stageWidth * .2,
				height: 10,
				scale: 1.2,
				color: Config.colors.font.info,
				alignment: 1
			});

		FontDrawing.segmentTextWithShadow("Highscore: " + highscore,
			{
				x: Config.general.stageWidth / 2,
				y: viewPort[1] + Config.general.stageHeight * .35,
				height: 10,
				scale: 1,
				color: Config.colors.font.regular,
				alignment: 1
			});

		FontDrawing.segmentTextWithShadow("press 'space' to play again",
			{
				x: Config.general.stageWidth/2, 
				y: viewPort[1] + Config.general.stageHeight*.55, 
				height: 10, 
				scale: .8,
				color: Config.colors.font.regular,
				alignment: 1
			});
	};

	this.welcome = function ()
	{
		var viewPort = this.draw2D.getViewport();
		Drawing.drawShadowOverlay(viewPort, Config.general.stageWidth, Config.general.stageHeight);

		FontDrawing.segmentTextWithShadow("Window Climber",
			{
				x: Config.general.stageWidth / 2,
				y: viewPort[1] + Config.general.stageWidth * .1,
				height: 25,
				scale: 2,
				color: Config.colors.font.title,
				alignment: 1
			});

		FontDrawing.segmentTextWithShadow("Clutch to windows, rotate, release and fly to the top!",
			{
				x: Config.general.stageWidth / 2,
				y: viewPort[1] + Config.general.stageWidth * .25,
				height: 10,
				scale: .8,
				color: Config.colors.font.regular,
				alignment: 1
			});

		FontDrawing.segmentTextWithShadow( "Controls:\n" +
			" Space - clutch or release" +
			"\n P - pause" +
			"\n R - reset",
			{
				x: Config.general.stageWidth / 2,
				y: viewPort[1] + Config.general.stageWidth*.4,
				height:10, 
				scale:.8,
				color: Config.colors.font.info,
				alignment: 1
			});
	};
};