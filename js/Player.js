define(['js/Actor.js', 'js/playerInput.js'], function(Actor, playerInput) {
	function Player(level, position) {
		Actor.apply(this, [level]);

		this.spawnPoint = position;

		this.createBody();
	}

	Player.inherits(Actor, function(base) {

		Player.prototype.legStrength = 0.0025;

		Player.prototype.createBody = function() {
			this.body = Matter.Bodies.circle(this.spawnPoint.x, this.spawnPoint.y, 15, {frictionAir: 0.25});
			this.body.label = "Player";

			this.level.addToWorld(this.body);
		};

		Player.prototype.tick = function(tickEvent) {
			base.tick.apply(this, arguments);

			this.doMovement(tickEvent);

			if(this.level.pointIsOutOfBounds(this.body.position)) {
				this.level.removeFromWorld(this.body);
				this.createBody();
			}
		};

		Player.prototype.doMovement = function(tickEvent) {
			var walkForce = Matter.Vector.mult(playerInput.getNormalizedMovement(), this.legStrength);

			if(Matter.Vector.magnitudeSquared(walkForce)) {
				Matter.Body.applyForce(this.body, this.body.position, walkForce);
				var walkAngle = Matter.Vector.angle({x: 0, y: 0}, walkForce);
				Matter.Body.rotate(this.body, -this.body.angle + walkAngle);
			}
		};

		Player.prototype.destroy = function() {
			base.destroy.apply(this, arguments);

			this.level.removeFromWorld(this.body);
		};

		Player.prototype.kill = function() {
			this.level.score += Infinity;
			this.level.playSoundAtPoint("dead", this.body.position);
			this.destroy();
		};
		
		Player.prototype.draw = function(render) {
			var ctx = render.context;
			ctx.beginPath();
			ctx.fillStyle = "blue";
			ctx.strokeStyle = "white";
			ctx.arc(this.body.position.x, this.body.position.y, this.body.circleRadius, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
		};
	});

	return Player;
});
