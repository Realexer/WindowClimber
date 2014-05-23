var Camera = new function ()
{
	this.followPlayer = function (draw2D, point, stageHeight, vPortWidth, vPortHeight)
	{
		var maxBottom = stageHeight - vPortHeight * 0.66;
		
		if (point[1] < maxBottom)
		{
			var playerYPos = point[1];
			var topOffcet = vPortHeight / 3;

			draw2D.configure({
				viewportRectangle: [0, playerYPos - topOffcet, vPortWidth, playerYPos + vPortHeight - topOffcet]
			});
		}
	};
};