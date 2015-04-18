var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies;

function Level(container) {
	// Variable aliases

	this.init(container);

	this.ctx = container.querySelector("canvas").getContext("2d");
}

Level.prototype.init = function(container) {
	this.engine = Engine.create(container);
	this.engine.world.gravity = {x:0, y:0};
	Engine.run(this.engine);
}
