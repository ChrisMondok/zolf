require(['js/Level.js', 'js/Ball.js', 'js/Floor.js'], function(Level, Ball, Floor) {
	function FloorDemoLevel() {
		Level.apply(this, arguments); //this sucks.
	};

	FloorDemoLevel.inherits(Level, function(base) {
		FloorDemoLevel.prototype.init = function() {
			base.init.apply(this, arguments);

			var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
			var ceil = Matter.Bodies.rectangle(400, 0, 810, 60, { isStatic: true });
			var left = Matter.Bodies.rectangle(0, 300, 60, 600, { isStatic: true });
			var right = Matter.Bodies.rectangle(800, 300, 60, 600, { isStatic: true });

			var ballBody = Matter.Bodies.circle(400, 300, 5, {density:.005, restitution:0.5});

			var ball = new Ball(this, ballBody);
			Matter.World.add(this.engine.world, [ground, ceil, left, right, ballBody]);
			
			var floor = new Floor(this, floorVerts);
		}
	});

	var level = new FloorDemoLevel(document.getElementById("gameArea"));

	return FloorDemoLevel;
});
