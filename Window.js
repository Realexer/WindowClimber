var Window = function (x, y, width, height, color)
{
	this.passed = false;
	this.timer = 0;
	this.touched = false;

	var lifeTime = 90; // 1.5 second

	if (color == undefined)
		color = Config.colors.windows.base;

	this.sprite = Draw2DSprite.create({
		width: width,
		height: height,
		x: x,
		y: y,
		origin: [0, 0],
		color: color
	});

	this.act = function ()
	{
		if (this.touched)
		{
			this.timer++;
		}

		this.sprite.setColor(Helper.colorWithAlpha(color, (lifeTime - this.timer)/lifeTime));
	};

	this.isFaded = function ()
	{
		return this.timer >= lifeTime;
	};
};

var WindowManager = function (stageWidth, stageHeight, xPadding)
{
	this.windows = [];
	this.windowsToDraw = [];
	this.topPosition = 0;
	this.minWindowsInStack = 3;

	this.stageParams =
	{
		width: stageWidth,
		height: stageHeight,
		xPadding: xPadding
	};

	this.clearWindows = function ()
	{
		this.windows = [];
		this.windowsToDraw = [];
		this.topPosition = 0;
	};

	this.addWindow = function (window)
	{
		this.windows.push(window);
	};

	this.getFirstWindow = function ()
	{
		var firstWin = null;
		for (var i = 0; i < this.windows.length; i++)
		{
			if (firstWin == null)
			{
				firstWin = this.windows[i];
			}
			else
			{
				var newFirstWin = this.windows[i];
				if (newFirstWin.sprite.y > firstWin.sprite.y)
				{
					firstWin = newFirstWin;
				}
			}
		}

		return firstWin;
	};

	this.generateWindowsFromLevel = function (level)
	{
		for (var i = 0; i < level.windows.length; i++)
		{
			var buildingPadding = (this.stageParams.width * level.buildingPadding);
			var width = this.stageParams.width - buildingPadding * 2;

			var position = this.stageParams.xPadding + buildingPadding + (width * level.positions[level.windows[i]]);
			var winWidth = width * level.windowWidth;
			var winHeight = this.stageParams.height * level.windowHeight;

			this.addWindow(new Window(position, this.topPosition, winWidth, winHeight));

			this.topPosition = this.topPosition - this.stageParams.height * level.windowSpacing;
		}
	};

	// yUp value is lower than yDown as we go up
	this.getWindowsToDraw = function (yUp, yDown)
	{
		for (var i = 0; i < this.windows.length; i++)
		{
			var win = this.windows[i];
			if (win.sprite.y + win.sprite.getHeight() >= yUp && win.sprite.y <= yDown)
			{
				this.windowsToDraw.push(win);
				this.windows.splice(i, 1);
				i--;
			}
		}

		var windows2Draw = [];
		for (var i = 0; i < this.windowsToDraw.length; i++)
		{
			var win = this.windowsToDraw[i];
			win.act();
			if (win.isFaded() == false)
			{
				windows2Draw.push(win.sprite);
			}
		}

		return windows2Draw;
	};


	this.isPointInOpenWindow = function (x, y)
	{
		var win = this.getWindowAtPoing(x, y);
		return win != null && win.touched == false;
	};

	this.getWindowAtPoing = function (x, y)
	{
		var returnWin = null;
		for (var i = 0; i < this.windowsToDraw.length; i++)
		{
			var win = this.windowsToDraw[i];
			if (win.sprite.y < y && (win.sprite.y + win.sprite.getHeight()) > y) // inside of the window height
			{
				if (win.sprite.x < x && (win.sprite.x + win.sprite.getWidth()) > x)
				{
					// inside of the window
					/*console.log("inside of the window");
					console.log("Y: " + win.sprite.y + " < " + Math.floor(y) + " && "
					+ (win.sprite.y + win.sprite.getHeight()) + " > " + Math.floor(y));
					console.log("X: " + win.sprite.x + " < " + Math.floor(x) + " && "
					+ (win.sprite.x + win.sprite.getWidth()) + " > " + Math.floor(x));*/
					if (win.isFaded() == false)
					{
						returnWin = win;
						break;
					}
				}
			}
		}

		return returnWin;
	};

	this.fadeOutWindowAtApoint = function (x, y)
	{
		var win = this.getWindowAtPoing(x, y);
		if (win)
		{
			win.touched = true;
		}
	};

	this.isNewWindowPassed = function (y)
	{
		for (var i = 0; i < this.windowsToDraw.length; i++)
		{
			var window = this.windowsToDraw[i];
			if (window.sprite.y > y && window.passed == false)
			{
				window.passed = true;

				if (window.isFaded() == true)
				{
					this.windowsToDraw.splice(i, 1);
				}

				return true;
			}
		}

		return false;
	};

	this.removePassedWindows = function (yDown)
	{
		for (var i = 0; i < this.windowsToDraw.length; i++)
		{
			var win = this.windowsToDraw[i];
			if (win.sprite.y > yDown)
			{
				this.windowsToDraw.splice(i, 1);
				i--;
			}
			else
			{
				break;
			}
		}
	};
};