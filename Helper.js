var Helper = new function ()
{
	this.color = function (r, g, b, a)
	{
		return [r / 255, g / 255, b / 255, a];
	};

	this.colorWithAlpha = function (color, alpha)
	{
		return [color[0], color[1], color[2], alpha];
	};
};