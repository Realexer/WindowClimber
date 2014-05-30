var Level = function (windowWidth, windowSpacing, windowHeight, positions, windows)
{
	this.windowWidth = (windowWidth != undefined) ? windowWidth : 0.4;
	this.windowHeight = (windowHeight != undefined) ? windowHeight : 0.25;
	this.windowSpacing = (windowSpacing != undefined) ? windowSpacing : 0.25;
	this.buildingPadding = 0.1;
	this.positions = (positions != undefined) ? positions : [0, 0.3, 0.6],
	this.windows = (windows != undefined) ? windows : [];
};
var Levels = [
	new Level(undefined, 0.27, undefined, undefined,
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
	new Level(undefined, undefined, undefined, undefined,
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
	new Level(undefined, 0.30, undefined, undefined,
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
	),
	new Level(undefined, 0.30, undefined, undefined,
			[
				0,
				2,
				0,
				2,
				0,
				2,
				0,
				2,
				0,
				2
			]
		),
	new Level(undefined, 0.40, undefined, undefined,
			[
				0,
				2,
				0,
				2,
				0,
				2,
				0,
				2,
				0,
				2
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
		this.currentLevel = getRandomLevel(this.currentLevel, this.levels.length);
		if (this.levels[this.currentLevel] == undefined)
		{
			this.currentLevel = 0;
		}
		return this.levels[this.currentLevel];
	};

	function getRandomLevel(currentLevel, numberOfLevels)
	{
		var randomLevel = currentLevel;

		while (randomLevel == currentLevel)
		{
			randomLevel = Math.floor(Math.random() * numberOfLevels - 1);
		}

		return randomLevel;
	}
};