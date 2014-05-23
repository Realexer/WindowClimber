var Borders = function (phys2D, sidesWidth, bottomWidth, width, height)
{
	return {
		createBody: function ()
		{
			var poligons = [
				[0, 0, sidesWidth, height],
				[(width - sidesWidth), 0, width, height],
				[0, (height - bottomWidth), width, height]
			];
			return phys2D.createRigidBody({
				type: 'static',
				shapes: [
					phys2D.createPolygonShape({
						vertices: phys2D.createRectangleVertices(poligons[0][0], poligons[0][1], poligons[0][2], poligons[0][3])
					}),
					phys2D.createPolygonShape({
						vertices: phys2D.createRectangleVertices(poligons[1][0], poligons[1][1], poligons[1][2], poligons[1][3])
					}),
					phys2D.createPolygonShape({
						vertices: phys2D.createRectangleVertices(poligons[2][0], poligons[2][1], poligons[2][2], poligons[2][3])
					})
				],
				userData: {
					color: [0.5, 0.6, 0.2, 1.0],
					poligons: poligons
				}
			});
		}
	};
};