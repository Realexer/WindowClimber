var Config = new function ()
{
	this.general = {
		stageWidth: 640,
		stageHeight: 480,
		vPortWidth: 640,
		vPortHeight: 480,
		xPadding: 80,
		bros: {
			size: 40
		},
		gravity: [0, 100],
		levelWidth: null,
		levelHeight: null
	};

	this.general.levelWidth = this.general.stageWidth - this.general.xPadding * 2;
	this.general.levelHeight = this.general.stageHeight;
	
	var broColor = Helper.color(252, 255, 157, 1.0);

	this.colors =
	{
		background: {
			building: Helper.color(118, 92, 81, 1.0),
			back: Helper.color(253, 255, 195, 1.0)
		},
		windows: {
			base: Helper.color(162, 201, 255, 1.0)
		},
		bros:
		{
			blackBro: broColor,
			whiteBro: broColor,
			clutch: {
				free: Helper.color(255, 145, 42, 1.0),
				fixed: Helper.color(189, 91, 3, 1.0)
			},
			constraint: broColor
		}
	};
};