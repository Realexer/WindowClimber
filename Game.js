var Game = function (canvas)
{
	this.debugEnabled = false;

	// game parameters
	this.paused =
	this.gameOver =
	this.autoPlay =
	this.welcome =
	this.score = undefined;

	this.playAgain = function ()
	{
		this.paused = false;
		this.gameOver = false;
		this.score = 0;

		this.createWorld();
	};

	this.reset = function ()
	{
		this.welcome = true;
		this.autoPlay.start();
		this.playAgain();
	};

	this.autoPlayAgain = function ()
	{
		this.autoPlay.reset();
		this.autoPlay.start();
		this.createWorld();
	};


	// use this this variable where we cannot reach game instance by using *this*
	var game = this;

	TurbulenzEngine = WebGLTurbulenzEngine.create({ canvas: canvas });


	// INIT DEVICES
	this.Ds =
	{
		graphics: TurbulenzEngine.createGraphicsDevice({}),
		math: TurbulenzEngine.createMathDevice({}),
		phys2D: Physics2DDevice.create(),
		input: TurbulenzEngine.createInputDevice({}),
		requestHandler: RequestHandler.create({}),
		fontManager: null,
		shaderManager: null
	};
	this.Ds.fontManager = FontManager.create(this.Ds.graphics, this.Ds.requestHandler);
	this.Ds.shaderManager = ShaderManager.create(this.Ds.graphics, this.Ds.requestHandler);

	// Game control
	this.GameControl = new GameControl(this, this.Ds.input);

	// INIT WORLD
	this.world = this.Ds.phys2D.createWorld({
		gravity: Config.general.gravity
	});


	// INIT DRAW DEVICES
	this.draw2D = Draw2D.create({
		graphicsDevice: this.Ds.graphics
	});

	this.physics2DDraw = Physics2DDebugDraw.create({
		graphicsDevice: this.Ds.graphics
	});

	this.draw2D.configure({
		viewportRectangle: [0, 0, Config.general.vPortWidth, -Config.general.vPortHeight],
		scaleMode: 'scale'
	});

	Drawing.setDraw2D(this.draw2D);
	Drawing.setPhysDraw2D(this.physics2DDraw);

	FontDrawing.setGraphicsDevice(this.Ds.graphics);
	FontDrawing.setMathDevice(this.Ds.math);
	FontDrawing.setDraw2D(this.draw2D);

	ScreenDraw.setDraw2D(this.draw2D);


	// get materials
	this.materials = new Materials(this.Ds.phys2D);

	// game objects
	this.windowManager = new WindowManager(Config.general.levelWidth, Config.general.levelHeight, Config.general.xPadding);
	this.levelManager = new LevelManager(Levels);
	this.bros = null;

	this.autoPlay = new Autoplay(this);

	this.prepare = function ()
	{
		FontDrawing.init();
	};

	this.createWorld = function ()
	{
		this.world.clear();

		this.bros = new Bros(this.Ds.phys2D, this.world, Config.general.bros.size);

		// reset windows
		this.windowManager.clearWindows();
		this.levelManager.reset();

		this.windowManager.topPosition = -Config.general.levelHeight / 2;
		this.windowManager.generateWindowsFromLevel(this.levelManager.getCurrentLevel());

		var firstWindow = this.windowManager.getFirstWindow();

		this.bros.init(firstWindow.sprite.x + firstWindow.sprite.getWidth() / 2, firstWindow.sprite.y + firstWindow.sprite.getHeight() / 2);
	};



	this.update = function ()
	{
		// run physics
		if (this.paused == false)
		{
			this.world.step(1 / 60);

			if (this.autoPlay.isActive)
			{
				this.autoPlay.act();
			}
			else
			{
				var fixedBro = this.bros.getFixedBro();
				if (fixedBro && this.windowManager.isNewWindowPassed(fixedBro.body.getPosition()[1]))
				{
					this.score++;
				}
			}

			this.bros.step(this.windowManager);
			this.bros.drawCamera(this.draw2D, Config.general.vPortWidth, Config.general.vPortHeight);


			if (this.bros.isOutOfTheBounce(Config.general.vPortWidth, this.draw2D.getViewport()[3]))
			{
				if (this.autoPlay.isActive == false)
				{
					this.gameOver = true;
				}

				this.autoPlayAgain();
			}
		}


		if (!this.Ds.graphics.beginFrame())
			return;

		// draw background
		this.Ds.graphics.clear();

		Background.drawBackground(this.draw2D.getViewport()[0], this.draw2D.getViewport()[1], Config.general.stageWidth, Config.general.stageHeight);
		Background.drawBuilding(Config.general.xPadding, this.draw2D.getViewport()[1], Config.general.levelWidth, Config.general.stageHeight);

		var windows = this.windowManager.getWindowsToDraw(this.draw2D.getViewport()[1], this.draw2D.getViewport()[3]);
		Drawing.drawSprites(windows);

		Drawing.drawPhysicsObjects(this.world.rigidBodies);


		this.physics2DDraw.setPhysics2DViewport(this.draw2D.getViewport());
		this.bros.drawConstraint(this.physics2DDraw);


		// Draw texts
		if (this.gameOver == false && this.autoPlay.isActive == false)
		{
			FontDrawing.start();

			FontDrawing.segmentText(5, this.draw2D.getViewport()[1] + 5, "Score: " + this.score, 10, 0.7);
		}

		if (this.debugEnabled)
		{
			Drawing.drawPhysicsWorld(this.world);
		}

		if (this.paused == true)
		{
			ScreenDraw.pause();
		}

		if (this.gameOver == true)
		{
			ScreenDraw.gameOver(this.score);
		}

		if (this.welcome)
		{
			ScreenDraw.welcome();
		}

		this.Ds.graphics.endFrame();

		this.windowManager.removePassedWindows(this.draw2D.getViewport()[3]);

		if (this.windowManager.windows.length < this.windowManager.minWindowsInStack)
		{
			this.windowManager.generateWindowsFromLevel(this.levelManager.getNextLevel());
		}
	};


	// resources preloading
	var loadedItems = 0;
	var itemsRequried = 2;

	this.loadResources = function ()
	{
		// loading font drawing data
		var urlMapping = {
			"fonts/bros.fnt": "assets/fonts/tz.fnt.json",
			"shaders/font.cgfx": "assets/shaders/font.cgfx.json"
		};
		var assetPrefix = "";
		this.Ds.shaderManager.setPathRemapping(urlMapping, assetPrefix);
		this.Ds.fontManager.setPathRemapping(urlMapping, assetPrefix);
		this.Ds.fontManager.load('fonts/bros.fnt', function (fontObject)
		{
			FontDrawing.setFont(fontObject);
			loadedItems++;
		});
		this.Ds.shaderManager.load('shaders/font.cgfx', function (shaderObject)
		{
			FontDrawing.setFontShader(shaderObject);
			loadedItems++;
		});
	};


	this.isReady = function ()
	{
		return loadedItems == itemsRequried;
	};

	this.pause = function ()
	{
		this.paused = !this.paused;
	};

	this.forcePause = function ()
	{
		this.paused = true;
	};


	this.act = function ()
	{
		if (this.welcome == true || this.gameOver == true)
		{
			this.welcome = false;
			this.autoPlay.stop();
			this.playAgain();
		}
		else
		{
			if (this.paused == false)
			{
				this.bros.act(this.windowManager);
			}
		}
	};


	return {
		Setup: function ()
		{
			game.loadResources();
		},

		Start: function ()
		{

			var loadingCheck = TurbulenzEngine.setInterval(function ()
			{
				if (game.isReady())
				{
					TurbulenzEngine.clearInterval(loadingCheck);

					game.prepare();
					game.reset();
					game.GameControl.readInput();
					TurbulenzEngine.setInterval(function () { game.update(); }, 1000 / 60);
				}
			}, 1000 / 60);
		},

		Pause: function ()
		{
			game.forcePause();
		}
	};
};