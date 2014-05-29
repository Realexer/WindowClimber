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

	this.segmentTextWithShadow = function (text, options)
	{
		this.segmentText(text, options);
		
		var shadowOptions = {
			x: options.x - 2,
			y: options.y - 2,
			color: Helper.color(0, 0, 0, 0.7),
			scale: options.scale,
			height: options.height,
			alignment: options.alignment 
		};
	
		this.segmentText(text, shadowOptions);
	};

	this.segmentText = function (text, options)
	{
		FontDrawing.start();
		
		var topLeft = this.draw2D.viewportUnmap(options.x, options.y);
		var bottomRight = this.draw2D.viewportUnmap(options.x, options.y + options.height);

		if (options.color)
		{
			this.fontDrawing.techniqueParams.color = options.color;
		}

		this.fontDrawing.font.drawTextRect(text, {
			rect: [topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]],
			scale: options.scale,
			spacing: 0,
			alignment: (options.alignment ? options.alignment : 0)
		});
	};
};