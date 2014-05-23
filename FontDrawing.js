var FontDrawing = new function ()
{
	this.graphicsD = null;
	this.mathD = null;
	this.draw2D = null;

	this.fontDrawing = {
		fontDrawing: null,
		shader: null,
		technique: null,
		techniqueParams: null
	};

	this.setDraw2D = function (draw2D)
	{
		this.draw2D = draw2D;
	};

	this.setGraphicsDevice = function (graphicsD)
	{
		this.graphicsD = graphicsD;
	};

	this.setMathDevice = function (mathD)
	{
		this.mathD = mathD;
	};

	this.setFont = function (fontObject)
	{
		this.fontDrawing.font = fontObject;
	};

	this.setFontShader = function (shaderObject)
	{
		this.fontDrawing.shader = shaderObject;
	};

	this.init = function ()
	{
		this.fontDrawing.technique = this.fontDrawing.shader.getTechnique('font');
		this.fontDrawing.techniqueParams = this.graphicsD.createTechniqueParameters({
			clipSpace: this.mathD.v4BuildZero(),
			alphaRef: 0.01,
			color: this.mathD.v4BuildOne()
		});
	};

	this.start = function ()
	{
		this.graphicsD.setTechnique(this.fontDrawing.technique);
		this.fontDrawing.techniqueParams.clipSpace =
			this.mathD.v4Build(2 / this.graphicsD.width, -2 / this.graphicsD.height, -1, 1, this.fontDrawing.techniqueParams.clipSpace);
		this.graphicsD.setTechniqueParameters(this.fontDrawing.techniqueParams);
	};

	this.segmentText = function (x, y, text, height, scale)
	{
		var topLeft = this.draw2D.viewportUnmap(x, y);
		var bottomRight = this.draw2D.viewportUnmap(x, y + height);

		this.fontDrawing.font.drawTextRect(text, {
			rect: [topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]],
			scale: scale,
			spacing: 0,
			alignment: 0
		});
	};
};