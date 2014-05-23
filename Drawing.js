// HELPER: Universal drawing
var Drawing = new function ()
{
	this.draw2D = null;
	this.setDraw2D = function (draw2D)
	{
		this.draw2D = draw2D;
	};

	this.physDraw2D = null;
	this.setPhysDraw2D = function (physDraw2D)
	{
		this.physDraw2D = physDraw2D;
	};
	
	this.drawShadowOverlay = function (viewPort, stageWidth, stageheight)
	{
		Drawing.drawSingleSprite(Draw2DSprite.create({
			x: viewPort[0],
			y: viewPort[1],
			width: stageWidth,
			height: stageheight,
			origin: [0, 0],
			color: Helper.color(10, 10, 10, 0.5)
		}), this.draw2D);
	};

	this.drawSingleSprite = function (sprite)
	{
		this.draw2D.begin('alpha', 'deferred');

		this.draw2D.drawSprite(sprite);

		this.draw2D.end();
	};

	this.drawSprites = function (sprites)
	{
		var limit = sprites.length;
		var i;

		this.draw2D.begin('alpha', 'deferred');
		for (i = 0; i < limit; i += 1)
		{
			this.draw2D.drawSprite(sprites[i]);
		}

		this.draw2D.end();
	};

	this.drawPhysicsObjects = function (bodies)
	{
		var limit = bodies.length;
		var i;

		this.draw2D.begin('alpha', 'deferred');
		var pos = [];
		for (i = 0; i < limit; i += 1)
		{
			var body = bodies[i];

			// static body
			if (body.shapes.length > 1)
			{
				for (var s = 0; s < body.shapes.length; s++)
				{
					var poligon = body.userData.poligons[s];

					var sprite = Draw2DSprite.create({
						x: poligon[0],
						y: poligon[1],
						width: poligon[2] - poligon[0],
						height: poligon[3] - poligon[1],
						origin: [0, 0],
						color: body.userData.color
					});
					this.draw2D.drawSprite(sprite);
				}
			}
			else if (body.userData)
			{
				body.getPosition(pos);
				var sprite = body.userData;
				sprite.x = pos[0];
				sprite.y = pos[1];
				sprite.rotation = body.getRotation();
				this.draw2D.drawSprite(sprite);
			}
		}

		this.draw2D.end();
	};

	this.drawPhysicsWorld = function (world)
	{
		var bodies = world.rigidBodies;
		var limit = bodies.length;
		var i;

		this.physDraw2D.begin();
		for (i = 0; i < limit; i += 1)
		{
			var body = bodies[i];
			if (!body.userData)
			{
				this.physDraw2D.drawRigidBody(body);
			}
		}
		this.physDraw2D.drawWorld(world);
		this.physDraw2D.end();
	};

};