var Platform = function (phys2D, width, height)
{
	if(height == undefined)
		height = 35;
	
	this.shape = phys2D.createPolygonShape({
		vertices: phys2D.createBoxVertices(width, height),
		material: phys2D.createMaterial({
			density: 2.5
		})
	});

	this.body = phys2D.createRigidBody({
		type: 'static',
		shapes: [this.shape],
		userData: Draw2DSprite.create({
			width: width,
			height: height,
			color: [1.0, 1.0, 1.0, 1.0]
		})
	});

	this.getBody = function (posX, posY)
	{
		this.body.setPosition([posX, posY]);
		return this.body;
	};
};