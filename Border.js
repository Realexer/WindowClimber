var Border = function (phys2D, width, height, texture)
{
	this.width = width;
	this.height = height;

	this.body = phys2D.createRigidBody({
		shapes: [phys2D.createPolygonShape({
			vertices: phys2D.createBoxVertices(width, height),
			density: 10.5
		})],
		userData: Draw2DSprite.create({
			texture: texture,
			textureRectangle: [0, 0, texture.width, texture.height],
			width: width,
			height: height,
			color: [0.6, 0.85, 0.4, 1.0]
		})
	});

	this.getPosition = function ()
	{
		return this.body.getPosition();
	};

	this.setPosition = function (x, y)
	{
		this.body.setRotation(0);
		this.body.setPosition([x + this.width / 2, y + this.height / 2]);
		return this.body;
	};
};