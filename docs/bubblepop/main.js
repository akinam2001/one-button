title = "Bubble Pop";

description = `
`;

const G = {
	WIDTH: 100,
	HEIGHT: 150,

	BUBBLE_SPEED_MIN: 0.25,
	BUBBLE_SPEED_MAX: 0.75,

	BUFFER: 2
}

options = {
	viewSize: { x: G.WIDTH, y: G.HEIGHT },
	seed: 1,
	isPlayingBgm: true,
	isReplayEnabled: true,
	//   theme?: "simple" | "pixel" | "shape" | "shapeDark" | "crt" | "dark";
	theme: "pixel",
};

/**
* @typedef {{
* pos: Vector,
* speed: number
* }} Bubble
*/

/**
* @type  { Bubble [] }
*/
let bubbles;

/**
* @typedef {{
* pos: Vector,
* growthRate: number,
* radius: number,
* growing: boolean
* }} Player
*/

/**
* @type { Player }
*/
let player;

/**
* @typedef {{
* pos: Vector,
* radius: number
* popped: boolean
* }} Circle
*/

/**
* @type { Circle }
*/
let circle;

characters = [];

function update() {
	if (!ticks) {
		bubbles = times(10, () => {
			// Random number generator function
			// rnd( min, max )
			const posX = rnd(0, G.WIDTH);
			const posY = rnd(0, G.HEIGHT);
			// An object of type Bubble with appropriate properties
			return {
				// Creates a Vector
				pos: vec(posX, posY),
				// More RNG
				speed: rnd(G.BUBBLE_SPEED_MIN, G.BUBBLE_SPEED_MAX)
			};
		});

		let radius = rnd(6,20);
		circle = {
			pos: vec(rnd(0 + radius + G.BUFFER, G.WIDTH - radius - G.BUFFER), rnd(0 + radius + G.BUFFER, G.HEIGHT - radius - G.BUFFER)),
			radius: radius,
			popped: false
		}

		player = {
			pos: circle.pos,
			growthRate: 0.2,
			radius: circle.radius/2,
			growing: true,
		}
	}

	// Update for Bubbles
	bubbles.forEach((b) => {
		// Move the bubble downwards
		b.pos.y += b.speed;
		// Bring the bubble back to top once it's past the bottom of the screen
		b.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

		// Choose a color to draw
		color("light_cyan");
		// Draw the bubble as a circle with radius 1 and thickness 10
		arc(b.pos, 10, 1);
	});

	if(circle.popped) {
		let radius = rnd(6,20);
		circle = {
			pos: vec(rnd(0 + radius + G.BUFFER, G.WIDTH - radius - G.BUFFER), 
								rnd(0 + radius + G.BUFFER, G.HEIGHT - radius - G.BUFFER)),
			radius: radius,
			popped: false
		}

		player = {
			pos: circle.pos,
			radius: circle.radius/2,
			growthRate: player.growthRate + 0.025,
			growing: true,
		}
	}
	// Choose a color to draw
	color("cyan");
	arc(circle.pos, circle.radius, 2.5 + circle.radius * 0.1);

	color("yellow");
	arc(player.pos, player.radius, 2.5 + player.radius * 0.1);
	if(player.growing) {
		player.radius += player.growthRate;
		if (player.radius > (circle.radius * 2)) {
			player.growing = false;
		}
	} else {
		player.radius -= player.growthRate;
		if (player.radius < (circle.radius/2)) {
			player.growing = true;
		}
	}

	if(input.isJustPressed) {
		if(arc(player.pos, player.radius, 2.5 + player.radius * 0.1).isColliding.rect.cyan) {
			circle.popped = true;
			addScore(1);
			play("jump");
		} else {
			end();
			play("explosion");
		}
		
	}

}
