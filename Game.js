var Game = function (canvas)
{
	this.debugEnabled = false;
	this.updateInterval = null;

	// game parameters
	this.paused =
	this.gameOver =
	this.autoPlay =
	this.welcome =
	this.score = undefined;

	this.highscore = 0;

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
		sound: TurbulenzEngine.createSoundDevice({
			deviceSpecifier: "DirectSound Software",
			linearDistance: true
		}),
		requestHandler: RequestHandler.create({}),
		fontManager: null,
		shaderManager: null
	};

	this.textures = {
		gripper: null,
		gripperPh1: null,
		gripperPh2: null,
		window: null,
		wall: null,
		background: null
	};

	this.sounds = {
		bros: {
			clutch: null,
			fly: null
		}
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


	Drawing.setDraw2D(this.draw2D);
	Drawing.setPhysDraw2D(this.physics2DDraw);

	FontDrawing.setGraphicsDevice(this.Ds.graphics);
	FontDrawing.setMathDevice(this.Ds.math);
	FontDrawing.setDraw2D(this.draw2D);

	ScreenDraw.setDraw2D(this.draw2D);

	SoundPlayer.init(this.Ds.sound, this.Ds.math);

	// get materials
	this.materials = new Materials(this.Ds.phys2D);

	// game objects
	this.building = null;
	this.windowManager = null;
	this.levelManager = new LevelManager(Levels);
	this.bros = null;

	this.autoPlay = new Autoplay(this);

	this.prepare = function ()
	{
		FontDrawing.init();
		this.windowManager = new WindowManager(Config.general.levelWidth, Config.general.levelHeight, Config.general.xPadding, this.textures.window);
		this.building = new Building(Config.general.stageWidth, Config.general.stageHeight, this.textures.wall);
	};

	this.startUpdating = function ()
	{
		console.log("Updating started");

		this.updateInterval = TurbulenzEngine.setInterval(function () { game.update(); }, 1000 / 60);
	};

	this.stopUpdating = function ()
	{
		if (this.updateInterval != null)
		{
			TurbulenzEngine.clearInterval(this.updateInterval);
			this.updateInterval = null;
		}

		console.log("Updating Stopped");
	};

	this.createWorld = function ()
	{
		this.stopUpdating();

		this.draw2D.configure({
			viewportRectangle: [0, 0, Config.general.vPortWidth, -Config.general.vPortHeight]
		});

		this.world.clear();

		this.bros = new Bros(this.Ds.phys2D, this.world, Config.general.bros.size, {
			normal: this.textures.gripper,
			active: this.textures.gripperPh1,
			gripped: this.textures.gripperPh2
		}, this.sounds.bros);


		// building
		this.building.reset();

		// reset windows
		this.windowManager.clearWindows();
		this.levelManager.reset();

		this.windowManager.topPosition = -Config.general.levelHeight / 2;
		this.windowManager.generateWindowsFromLevel(this.levelManager.getCurrentLevel());

		var firstWindow = this.windowManager.getFirstWindow();

		this.bros.init(firstWindow.sprite.x + firstWindow.sprite.getWidth() / 2, firstWindow.sprite.y + firstWindow.sprite.getHeight() / 2);


		game.startUpdating();
	};



	this.update = function ()
	{
		//console.log("Updating...");
		if (!this.Ds.graphics.beginFrame())
			return;

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
					this.highscore = Math.max(this.score, this.highscore);

				}
			}

			this.windowManager.act();
			this.bros.step(this.windowManager);
			this.bros.drawCamera(this.draw2D, Config.general.vPortWidth, Config.general.vPortHeight);


			if (this.bros.isOutOfTheBounce(Config.general.vPortWidth, this.draw2D.getViewport()[3]))
			{
				if (this.autoPlay.isActive == false)
				{
					this.gameOver = true;
				}

				this.autoPlayAgain();
				return;
			}
		}


		// draw background
		this.Ds.graphics.clear();

		Background.drawBackground(this.draw2D.getViewport()[0], this.draw2D.getViewport()[1], Config.general.stageWidth, Config.general.stageHeight, this.textures.background);

		Drawing.drawSprites(this.building.getBuildingToDraw(this.draw2D.getViewport()[1]));


		var windows = this.windowManager.getWindowsToDraw(this.draw2D.getViewport()[1], this.draw2D.getViewport()[3]);
		Drawing.drawSprites(windows);

		Drawing.drawPhysicsObjects(this.world.rigidBodies);


		this.physics2DDraw.setPhysics2DViewport(this.draw2D.getViewport());
		this.bros.drawConstraint(this.physics2DDraw);

		if (this.debugEnabled)
		{
			Drawing.drawPhysicsWorld(this.world);
		}

		// Draw texts
		if (this.gameOver == false && this.autoPlay.isActive == false)
		{
			FontDrawing.segmentTextWithShadow("Score: " + this.score,
				{
					x: 5,
					y: this.draw2D.getViewport()[1] + 5,
					height: 10,
					scale: 1,
					color: Config.colors.font.regular
				});
		}

		FontDrawing.segmentTextWithShadow("Pilot version",
			{
				x: this.draw2D.getViewport()[2] - 140,
				y: this.draw2D.getViewport()[1] + 5,
				height: 10,
				scale: 1,
				color: Config.colors.font.info
			});


		if (this.paused == true)
		{
			ScreenDraw.pause();
		}

		if (this.gameOver == true)
		{
			ScreenDraw.gameOver(this.score, this.highscore);
		}

		if (this.welcome)
		{
			ScreenDraw.welcome();
		}

		this.Ds.graphics.endFrame();

		this.windowManager.update(this.draw2D.getViewport()[3], this.levelManager);
		this.building.update(this.draw2D.getViewport()[3]);
	};


	// resources preloading
	var loadedItems = 0;
	var itemsRequried = 2;

	this.loadResources = function ()
	{
		// loading font drawing data
		var urlMapping = {
			"fonts/bros.fnt": "assets/fonts/WindowClimber.fnt.json",
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


		// load textures
		itemsRequried += loadImage("assets/images/Gripper.png", function (t) { game.textures.gripper = t; });
		itemsRequried += loadImage("assets/images/GripperPhase1.png", function (t) { game.textures.gripperPh1 = t; });
		itemsRequried += loadImage("assets/images/GripperPhase2.png", function (t) { game.textures.gripperPh2 = t; });
		itemsRequried += loadImage("assets/images/Window.png", function (t) { game.textures.window = t; });
		itemsRequried += loadImage("assets/images/Wall.png", function (t) { game.textures.wall = t; });
		itemsRequried += loadImage("assets/images/Background.png", function (t) { game.textures.background = t; });

		itemsRequried += loadSound("assets/sounds/Clutch.mp3", function (s) { game.sounds.bros.clutch = s; });
		itemsRequried += loadSound("assets/sounds/Fly.mp3", function (s) { game.sounds.bros.fly = s; });


		function loadImage(url, callback)
		{
			game.Ds.graphics.createTexture({
				src: url,
				mipmaps: true,
				onload: function (texture)
				{
					if (texture)
					{
						callback(texture);
						loadedItems++;
					}
				}
			});


			return 1;
		}

		function loadSound(url, callback)
		{
			game.Ds.sound.createSound({
				src: url,
				uncompress: false,
				onload: function (s)
				{
					if (s)
					{
						callback(s);
						loadedItems++;
					}
				}
			});

			return 1;
		}
	};


	this.isReady = function ()
	{
		return loadedItems == itemsRequried;
	};

	this.pause = function ()
	{
		if (this.gameOver == false && this.welcome == false)
		{
			this.paused = !this.paused;
		}
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
		Focus: function ()
		{
			game.Ds.input.onFocus();
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
					game.Ds.input.onFocus();
				}
			}, 1000 / 60);
		},

		Pause: function ()
		{
			game.forcePause();
		}
	};
};