var GameControl = function (game, inputD)
{
	var gControl = this;
	this.readInput = function ()
	{
		inputD.addEventListener("keydown", function (keyNum)
		{
			gControl.handleKeyDown(keyNum);
		});

		inputD.addEventListener("keyup", function (keyNum)
		{
			gControl.handleKeyUp(keyNum);
		});
	};

	this.handleKeyDown = function (keyNum)
	{
		if (keyNum == inputD.keyCodes.SPACE)
		{
			game.act();
		}

		if (keyNum == inputD.keyCodes.R)
		{
			game.reset();
		}

		if (keyNum == inputD.keyCodes.P)
		{
			game.pause();
		}
	};

	this.handleKeyUp = function (keyNum)
	{

	};
};