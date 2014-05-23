var Bros = function (phys2D, world, size)
{
	var bros = this;
	this.world = world;
	this.distanceFlied = 0;

	var minDistance = 3;
	var maxDistance = 3;

	var initialFixedBroYPos = 0;

	
	function createShape()
	{
		return phys2D.createCircleShape({
			radius: size / 2,
			material: phys2D.createMaterial({
				elasticity: 1.5,
				staticFriction: 6,
				dynamicFriction: 4,
				rollingFriction: 0.001,
				density: 2.5
			})
		});
	};

	function createBro(color, shape, fixed)
	{
		return {
			fixed: fixed,
			originColor: color,
			body: phys2D.createRigidBody({
				shapes: [shape],
				userData: Draw2DSprite.create({
					width: size,
					height: size,
					origin: [size / 2, size / 2],
					color: color
				})
			})
		};
	};

	function createBrosConstraint(blackBro, whiteBro)
	{
		return phys2D.createDistanceConstraint({
			bodyA: blackBro.body,
			bodyB: whiteBro.body,
			anchorA: [0, 0],
			anchorB: [0, 0],
			lowerBound: size * minDistance,
			upperBound: size * maxDistance,
			stiff: true
		});
	};

	function performClutch(wrold, bro)
	{
		var point = [bro.body.getPosition()[0], bro.body.getPosition()[1]];
		clutchConstraint = phys2D.createPointConstraint({
			bodyA: clutchPoint,
			bodyB: bro.body,
			anchorA: point,
			anchorB: [0.0, 0.0],
			stiff: true,
			maxForce: 1e5
		});

		world.addConstraint(clutchConstraint);

		bro.fixed = true;
	};

	function performAutoMove()
	{
		var velocity = 350;
		var fixedBro = bros.getFixedBro();
		if (!fixedBro)
			return;

		var freeBro = bros.getFreeBro();
		var currentVel = freeBro.body.getVelocity()[1];
		if (Math.abs(currentVel) > (velocity * 0.9))
		{
			//console.log("Spped is " + currentVel);
			return;
		}

		var angle = Math.atan2(fixedBro.body.getPosition()[1] - freeBro.body.getPosition()[1],
			fixedBro.body.getPosition()[0] - freeBro.body.getPosition()[0]) * 180 / Math.PI;

		var direction = -1;
		if (angle < 0)
		{
			direction = 1;
		}


		//console.log("Angle: " + angle);
		freeBro.body.setVelocity([velocity * direction, freeBro.body.getVelocity()[1]]);
	}


	function getBroToClutch(windowManager)
	{
		var broToClutch = null;

		var higherBro = bros.whiteBro;
		var lowerBro = bros.blackBro;

		if (bros.blackBro.body.getPosition()[1] < bros.whiteBro.body.getPosition()[1])
		{
			higherBro = bros.blackBro;
			lowerBro = bros.whiteBro;
		}

		if (higherBro.fixed == false && windowManager.isPointInOpenWindow(higherBro.body.getPosition()[0], higherBro.body.getPosition()[1]))
		{
			broToClutch = higherBro;
		} else if (lowerBro.fixed == false && windowManager.isPointInOpenWindow(lowerBro.body.getPosition()[0], lowerBro.body.getPosition()[1]))
		{
			broToClutch = lowerBro;
		}

		return broToClutch;
	};


	// instance
	this.blackBro = createBro(Config.colors.bros.blackBro, createShape(), true);
	this.whiteBro = createBro(Config.colors.bros.whiteBro, createShape(), false);


	var clutchPoint = phys2D.createRigidBody({
		type: 'static'
	});

	var clutchConstraint = null;

	this.init = function (x, y)
	{
		this.world.addRigidBody(clutchPoint);

		this.world.addRigidBody(this.whiteBro.body);
		this.world.addRigidBody(this.blackBro.body);
		this.world.addConstraint(createBrosConstraint(this.blackBro, this.whiteBro));

		this.reset(x, y);
		performClutch(this.world, this.blackBro);
		initialFixedBroYPos = this.blackBro.body.getPosition()[1];
	};

	this.drawConstraint = function (physics2DDraw)
	{
		physics2DDraw.begin();
		physics2DDraw.drawLine(
			this.whiteBro.body.getPosition()[0],
			this.whiteBro.body.getPosition()[1],
			this.blackBro.body.getPosition()[0],
			this.blackBro.body.getPosition()[1],
			Config.colors.bros.constraint);
		physics2DDraw.end();

	};

	this.step = function (windowManager)
	{
		// restore colors
		this.whiteBro.body.userData.setColor(this.whiteBro.originColor);
		this.blackBro.body.userData.setColor(this.blackBro.originColor);

		if (this.whiteBro.fixed == false && this.blackBro.fixed == false)
		{
			// highlight clutching bro
			var broToClutch = getBroToClutch(windowManager);
			if (broToClutch)
			{
				broToClutch.body.userData.setColor(Config.colors.bros.clutch.free);
			}
		}

		var fixedBro = this.getFixedBro();
		if (fixedBro)
		{
			fixedBro.body.userData.setColor(Config.colors.bros.clutch.fixed);


			var windowBroIsOn = windowManager.getWindowAtPoing(fixedBro.body.getPosition()[0], fixedBro.body.getPosition()[1]);
			if (windowBroIsOn == null)
			{
				this.fly();
			}
		}

		performAutoMove();
	};

	this.act = function (windowManager)
	{	
		if (this.getFixedBro() != null)
		{
			this.fly();
		}
		else
		{
			var broToClutch = getBroToClutch(windowManager);
			if (broToClutch)
			{
				this.clutch(broToClutch, windowManager);
			}
		}
	};


	this.clutch = function (broToClutch, windowManager)
	{
		performClutch(this.world, broToClutch);
		var fixedBro = this.getFixedBro();
		if (fixedBro)
		{
			this.distanceFlied = Math.max(Math.abs(fixedBro.body.getPosition()[1]) - Math.abs(initialFixedBroYPos), this.distanceFlied);
		}

		windowManager.fadeOutWindowAtApoint(broToClutch.body.getPosition()[0], broToClutch.body.getPosition()[1]);
	};


	this.fly = function ()
	{
		if (clutchConstraint)
		{
			this.world.removeConstraint(clutchConstraint);
			clutchConstraint = null;
			this.blackBro.fixed = this.whiteBro.fixed = false;
		}
	};

	this.getPosition = function ()
	{
		var blackPos = this.blackBro.body.getPosition();
		var whitePos = this.whiteBro.body.getPosition();

		var y = Math.min(blackPos[1], whitePos[1]);


		return [(blackPos[0] + whitePos[0]) / 2, y - size * 2];
	};


	this.getFreeBro = function ()
	{
		var bro = null;
		if (this.blackBro.fixed == false)
		{
			bro = this.blackBro;
		}
		else if (this.whiteBro.fixed == false)
		{
			bro = this.whiteBro;
		}

		return bro;
	};

	this.getFixedBro = function ()
	{
		var bro = null;
		if (this.whiteBro.fixed == true)
		{
			bro = this.whiteBro;
		}
		else if (this.blackBro.fixed == true)
		{
			bro = this.blackBro;
		}

		return bro;
	};

	this.reset = function (posX, posY)
	{
		this.blackBro.body.setPosition([posX, posY]);
		this.whiteBro.body.setPosition([posX, posY + size * 2]);
	};

	this.clear = function ()
	{
		this.whiteBro.body.setVelocity([0, 0]);
		this.whiteBro.body.setVelocity([0, 0]);
	};

	var topPosition = 0;
	this.drawCamera = function (draw2D, vPortWidth, vPortHeight)
	{
		var newTopPosition = Math.min(this.getPosition()[1], topPosition);

		var maxBottom = vPortHeight - vPortHeight * 0.66;

		if (newTopPosition < maxBottom)
		{
			var topOffcet = vPortHeight / 3;

			draw2D.configure({
				viewportRectangle: [0, newTopPosition - topOffcet, vPortWidth, newTopPosition + vPortHeight - topOffcet]
			});
		}

		topPosition = newTopPosition;
	};

	this.isOutOfTheBounce = function (vPortWidth, downLine)
	{
		var result = false;

		var fixedBro = this.getFixedBro();
		if (fixedBro != null)
		{
			return result;
		}

		var blackBroPos = this.blackBro.body.getPosition();
		var whiteBroPos = this.whiteBro.body.getPosition();


		if (whiteBroPos[0] < -size && blackBroPos[0] < -size)
		{
			console.log("falled out of the left side");
			result = true;
		}

		if (whiteBroPos[0] > vPortWidth + size && blackBroPos[0] > vPortWidth + size)
		{
			console.log("falled out of the right side");
			result = true;
		}

		if (whiteBroPos[1] > downLine + size && blackBroPos[1] > downLine + size)
		{
			console.log("falled out of the bottom line");
			result = true;
		}

		return result;
	};
};