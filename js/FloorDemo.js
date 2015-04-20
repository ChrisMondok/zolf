require(['js/Level.js', 'js/Ball.js', 'js/Floor.js', 'js/Player.js', 'js/Sand.js', 'js/Water.js'],
function(Level, Ball, Floor, Player, Sand, Water) {
	function FloorDemoLevel() {
		Level.apply(this, arguments); //this sucks.
	}

	FloorDemoLevel.inherits(Level, function(base) {

		FloorDemoLevel.prototype.bgm = "bgm1"

		FloorDemoLevel.prototype.init = function() {
			base.init.apply(this, arguments);

			var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
			var ceil = Matter.Bodies.rectangle(400, 0, 810, 60, { isStatic: true });
			var left = Matter.Bodies.rectangle(0, 300, 60, 600, { isStatic: true });
			var right = Matter.Bodies.rectangle(800, 300, 60, 600, { isStatic: true });

			var ball = new Ball(this, {x: 400, y: 300});
			Matter.World.add(this.engine.world, [ground, ceil, left, right]);
			
			var floor = new Floor(this, floorVerts);
			var water = new Water(this, waterVerts);

			var sand = new Sand(this, sandVerts);

			this.player = new Player(this, {x: 600, y: 400});

		};
	});

	var level = new FloorDemoLevel(document.getElementById("gameArea"));
});
