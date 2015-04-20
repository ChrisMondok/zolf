define([], function() {
	
	var Rendererer = {
		
		create: function(config) {
			
			var defaults = {
				width: 800,
				height: 600,
				playerMargin: 200,
				center: {x: 400, y: 300},
				options: {},
				images: {}
			};

			var render = Matter.Common.extend(defaults, config);

			render.frame = 0;
			render.controller = Rendererer;
			render.canvas = createCanvas(render.width, render.height);
			render.context = render.canvas.getContext("2d");

			render.patterns = {};
			for(var key in render.images)
				render.patterns[key] = render.context.createPattern(render.images[key], "repeat");

			
			config.element.appendChild(render.canvas);

			if(render.options.debug) {
				render.debugX = 0;
				render.debugT = new Date().getTime();
				render.debugGraphContext = createRenderGraph().getContext('2d');
			}
			
			return render;
		},
		
		world: function(engine) {
			var render = engine.render;

			render.frame++;
			render.timestamp = new Date().getTime();

			var world = engine.world;
			var ctx = render.context;
			var bodies = world.bodies;
			

			ctx.save();
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			ctx.translate(render.width / 2 - render.center.x,render.height/2 - render.center.y);

			render.level.drawBackground(render);

			for(var a=0; a<render.level.actors.length; a++)
				if(render.level.actors[a].drawBackground)
					render.level.actors[a].drawBackground(render);
				
			ctx.fillStyle = "black";
			
			for(var b=0; b<bodies.length; b++)
				drawBody(ctx, bodies[b]);
			
			for(var a=0; a<render.level.actors.length; a++)
				render.level.actors[a].draw(render);

			render.level.draw(render);

			ctx.restore();

			if(render.options.debug) {
				updateDebugGraph(render);
			}
		},

		moveIntoView: function(engine, point) {
			var render = engine.render;

			render.center.x = render.center.x.clamp(point.x - render.playerMargin, point.x + render.playerMargin);
			render.center.y = render.center.y.clamp(point.y - render.playerMargin, point.y + render.playerMargin);

			render.center.x = render.center.x.clamp(engine.world.bounds.min.x + render.width/2, engine.world.bounds.max.x - render.width/2);
			render.center.y = render.center.y.clamp(engine.world.bounds.min.y + render.height/2, engine.world.bounds.max.y - render.height/2);
		},
		
		clear: function() {

		}
	};
	
	function createCanvas(width, height){
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
        canvas.oncontextmenu = function() { return false; };
        canvas.onselectstart = function() { return false; };
        return canvas;
	}

	function createRenderGraph() {
		var renderGraph = document.createElement('canvas');
		renderGraph.height = 200;
		renderGraph.width = 800;
		document.body.appendChild(renderGraph);
		return renderGraph;
	}

	function updateDebugGraph(render) {
		var now = new Date().getTime();
		var dt = now - render.debugT;

		var x = render.debugX % render.debugGraphContext.canvas.width;
		var y = render.debugGraphContext.canvas.height - dt;

		render.debugGraphContext.fillStyle = "white";
		render.debugGraphContext.beginPath();
		render.debugGraphContext.moveTo(x, 0);
		render.debugGraphContext.lineTo(x, render.debugGraphContext.canvas.height);
		render.debugGraphContext.lineTo(x + 10, render.debugGraphContext.canvas.height);
		render.debugGraphContext.lineTo(x + 10, 0);
		render.debugGraphContext.fill();

		render.debugGraphContext.beginPath();
		render.debugGraphContext.fillStyle = "black";
		render.debugGraphContext.moveTo(x, y);
		render.debugGraphContext.lineTo(x, render.debugGraphContext.canvas.height);
		render.debugGraphContext.lineTo(x + 1, render.debugGraphContext.canvas.height);
		render.debugGraphContext.lineTo(x + 1, y);
		render.debugGraphContext.fill();

		drawLineAtFps(60, "green");
		drawLineAtFps(30, "coral");
		drawLineAtFps(15, "red");

		function drawLineAtFps(fps, color) {
			render.debugGraphContext.strokeStyle = color;
			render.debugGraphContext.beginPath();
			render.debugGraphContext.moveTo(0, render.debugGraphContext.canvas.height - 1000/fps);
			render.debugGraphContext.lineTo(render.debugGraphContext.canvas.width, render.debugGraphContext.canvas.height - 1000/fps);
			render.debugGraphContext.stroke();
		}

		render.debugT = now;
		render.debugX++;
	}

	function drawBody(ctx, body) {
		if(body.label === "Rectangle Body")
			drawRectangle(ctx,body);
		else if(body.label === "Circle Body")
			drawCircle(ctx,body);
		else
			drawVertices(ctx,body.vertices);
	}
	
	function drawRectangle(ctx, body) {
		drawVertices(ctx, body.vertices);
	}
	
	function drawCircle(ctx, body) {
		ctx.beginPath();
		ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
		ctx.fill();
	}
	
	function drawVertices(ctx, verts) {
		ctx.beginPath();
		ctx.polygon(verts);
		ctx.fill();
	}
	
	return Rendererer;
	
});
