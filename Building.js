var Building = function (width, height, texture)
{
	var building = this;

	this.width = width;
	this.height = height;
	this.texture = texture;
	this.sprites = [];

	var requiredAmountOfSprites = 3;

	function getTopSprite(sprites)
	{
		var topSprite = null;
		for (var i = 0; i < sprites.length; i++)
		{
			var sprite = sprites[i];
			if (topSprite == null)
			{
				topSprite = sprite;
			}
			else
			{
				if (sprite.y < topSprite.y)
				{
					topSprite = sprite;
				}
			}
		}

		return topSprite;
	}

	this.reset = function ()
	{
		this.sprites = [];
	};

	this.generateSprites = function (yTop, amount)
	{
		for (var i = 0; i < amount; i++)
		{
			var sprite = { y: yTop - this.height * i };

			this.sprites.push(sprite);
		}
	};

	this.getBuildingToDraw = function (y)
	{
		var spritesToDraw = [];
		if (this.sprites.length == 0)
		{
			this.generateSprites(y, requiredAmountOfSprites);
		}

		this.sprites.forEach(function (sprite)
		{
			spritesToDraw.push(Draw2DSprite.create({
				x: 0,
				y: sprite.y,
				width: building.width,
				height: building.height,
				origin: [0, 0],
				texture: building.texture,
				textureRectangle: [0, 0, building.texture.width, building.texture.height],
				color: (!texture ? Config.colors.background.back : null)
			}));
		});

		return spritesToDraw;
	};

	this.update = function (yDown)
	{
		if (this.sprites.length < requiredAmountOfSprites)
		{
			var topSprite = getTopSprite(this.sprites);
			var y = topSprite ? topSprite.y : yDown + this.height;

			this.generateSprites(y - this.height, requiredAmountOfSprites - this.sprites.length);
		}

		for (var i = 0; i < this.sprites.length; i++)
		{
			var sprite = this.sprites[i];
			if (sprite.y > yDown + this.height)
			{
				this.sprites.splice(i, 1);
				i--;
			}
		}
	};
};