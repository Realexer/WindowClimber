var Level = function (windowWidth, windowSpacing, windowHeight, positions, windows)
{
	this.windowWidth = (windowWidth != undefined) ? windowWidth : 0.5;
	this.windowHeight = (windowHeight != undefined) ? windowHeight : 0.30;
	this.windowSpacing = (windowSpacing != undefined) ? windowSpacing : 0.38;
	this.buildingPadding = 0.1;
	this.positions = (positions != undefined) ? positions : [0, 0.25, 0.5],
	this.windows = (windows != undefined) ? windows : [];
};
var Levels = [
	new Level(undefined, undefined, undefined, undefined,
		[
			1,
			1,
			1,
			1,
			0,
			1,
			2,
			1,
			1
		]
	),
	new Level(undefined, 0.45, undefined, undefined,
		[
			0,
			0,
			2,
			2,
			0,
			0,
			2,
			2,
			1
		]
	),
	new Level(undefined, 0.42, undefined, undefined,
		[
			0,
			2,
			2,
			0,
			0,
			2,
			0,
			2,
			0
		]
	)
];

// levels = array
var LevelManager = function (levels)
{
	this.levels = levels;
	this.currentLevel = 0;

	this.reset = function ()
	{
		this.currentLevel = 0;
	};

	this.getCurrentLevel = function ()
	{
		return this.levels[this.currentLevel];
	};

	this.getNextLevel = function ()
	{
		this.currentLevel++;
		if (this.levels[this.currentLevel] == undefined)
		{
			this.currentLevel = 0;
		}
		return this.levels[this.currentLevel];
	};
};