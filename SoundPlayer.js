var SoundPlayer = new function ()
{
	this.soundDevice = null;
	this.mathDevice = null;
	this.source = null;

	this.init = function (soundD, mathD)
	{
		this.soundDevice = soundD;
		this.mathDevice = mathD;

		this.source = this.soundDevice.createSource({
			position: this.mathDevice.v3Build(0, 0, 0),
			direction: this.mathDevice.v3Build(1, 0, 0),
			velocity: this.mathDevice.v3Build(0, 0, 0),
			gain: 0.7,
			minDistance: 1.0,
			maxDistance: 100.0,
			rollOff: 1.0,
			relative: false,
			looping: false,
			pitch: 1.0
		});
	};

	this.play = function (sound)
	{
		this.source.play(sound);
	};
};