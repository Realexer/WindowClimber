var Autoplay = function (game)
{
	this.game = game;
	this.actingInterval = 0;
	this.isActive = false;

	var minActingInterval = 29;
	var actingIntervalMargin = 4;

	var timer = 0;

	function getActingInterval()
	{
		return minActingInterval + Math.floor(Math.random() * actingIntervalMargin);
	}

	this.reset = function ()
	{
		timer = 0;
	};

	this.start = function ()
	{
		this.reset();
		this.isActive = true;
		this.actingInterval = getActingInterval();
	};

	this.stop = function ()
	{
		this.isActive = false;
	};


	this.act = function ()
	{
		if (this.isActive)
		{
			if (timer > this.actingInterval)
			{
				this.game.bros.act(this.game.windowManager);
				timer = 0;
				this.actingInterval = getActingInterval();
			}
			timer++;
		}
	};
};