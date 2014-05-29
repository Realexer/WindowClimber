var Background = new function ()
{
	var bgSprite = null;
	this.drawBuilding = function (x, y, width, height, texture)
	{
		if (bgSprite == null)
		{
			bgSprite = Draw2DSprite.create({
				x: x,
				y: y,
				width: width,
				height: height,
				origin: [0, 0],
				texture: texture,
				textureRectangle: [0, 0, texture.width, texture.height],
				color: (!texture ? Config.colors.background.building : null)
			});
		}

		Drawing.drawSingleSprite(bgSprite);
	};

	this.drawBackground = function (x, y, width, height, texture)
	{
		Drawing.drawSingleSprite(Draw2DSprite.create({
			x: x,
			y: y,
			width: width,
			height: height,
			origin: [0, 0],
			texture: texture,
			textureRectangle: [0, 0, texture.width, texture.height],
			color: (!texture ? Config.colors.background.back : null)
		}));
	};
};