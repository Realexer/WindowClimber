var Background = new function ()
{
	this.drawBuilding = function (x, y, width, height)
	{
		Drawing.drawSingleSprite(Draw2DSprite.create({
			x: x,
			y: y,
			width: width,
			height: height,
			origin: [0, 0],
			color: Config.colors.background.building
		}), this.draw2D);
	};

	this.drawBackground = function(x, y, width, height)
	{
		Drawing.drawSingleSprite(Draw2DSprite.create({
			x: x,
			y: y,
			width: width,
			height: height,
			origin: [0, 0],
			color: Config.colors.background.back
		}), this.draw2D);
	};
};