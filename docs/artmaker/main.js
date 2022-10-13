title = "Art Maker";

description = `Press and Hold for Options`;

characters = [  
`
 l l
lllll
lllll
 lll
  l
`,`
 llll
l    l
ll  ll
l    l
l ll l
 llll 
`,`
 llll
ll l l
lllll
 ll
  lll

`, `
  ll
 l  l
l    l
l    l
l ll l
ll  ll
`, `
RRRRR
RRGGG
RRGGG
RRRRR
RR  R
RR  R
`,`
  yy
  rr
  
  YY
  YY
  YY
`,`
  G   
 yyGy
yyyyyy
yyyyyy
yyyyyy
 yyyy
`,`
  RRR
 RRrrR
 YrRRr
YYrRrR
YYYRRR
 YYYYY
`,`
   g
  ggg
  ggg
 ggggg
 ggggg
   y
   y
`,`
  ggg
 ggggg
Gggggg
 G   G
`
];

const G = {
	WIDTH: 200,
	HEIGHT: 100,

	MIN_SPEED: 0.05,
	MAX_SPEED: 1
}

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
	isShowingScore: false,
	isCapturing: true,
	isCapturingGameCanvasOnly: true,
  // theme?: "simple" | "pixel" | "shape" | "shapeDark" | "crt" | "dark";
  theme: "simple"
};

/**
* @type  { Color [] }
*/
const colors = [
	"white",
	"red" ,
	"green",
	"yellow",
	"blue",
	"purple",
	"cyan",
	"black",
	"light_red",
	"light_green",
	"light_yellow",
	"light_blue",
	"light_purple",
	"light_cyan",
	"light_black"
]

/**
 * @typedef {{
 * pos: Vector,
 * speed: Vector,
 * char: String,
 * color: Color
 * scale: Object
 * }} Shape
 */

// shape: char

/**
 * @type { Shape }
 */
let shape;

/**
* @type  { Shape [] }
*/
let shapes;

let timePressed;
let firstClick;

let placeBeg;
let skipBeg;
let finishBeg;

let notFinished;

function update() {
	if (!ticks) {
		let charNum = rndi(characters.length);
		let rScale = rndi(1, 4);

		shape = {
			pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)),
			speed: vec(rnds(G.MAX_SPEED), rnds(G.MAX_SPEED)),
			char: String.fromCharCode(97 + charNum),
			color: charNum < 4 ? colors[rndi(colors.length)] : "black",
			scale: { scale: { x: rScale, y: rScale } }
		}

		shapes = [];
		shapes.push(shape);

		timePressed = 0;
		
		firstClick = true;
		
		placeBeg = "> ";
		skipBeg = "  ";
		finishBeg = "  ";
		
		notFinished = true;
		
	}

	shape.pos.x += shape.speed.x;
	shape.pos.y += shape.speed.y;
	shape.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
	
	
	if (input.isPressed) {
		if (!firstClick) {
			timePressed++;
		}
	} else if(input.isJustReleased) {		
		if (firstClick) {
			firstClick = false;
		}
		
		if(timePressed/60 < 1 && timePressed/60 > 0) {
			let charNum = rndi(characters.length);
			let rScale = rndi(1, 4);

			shape = {
				pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)),
				speed: vec(rnds(G.MAX_SPEED), rnds(G.MAX_SPEED)),
				char: String.fromCharCode(97 + charNum),
				color: charNum < 4 ? colors[rndi(colors.length)] : "black",
				scale: { scale: { x: rScale, y: rScale } }
			}

			shapes.push(shape);
		} else if (timePressed / 60 < 3 && timePressed/60 > 0) {
			let charNum = rndi(characters.length);
			let rScale = rndi(1, 4);
			
			shape.char = String.fromCharCode(97 + charNum);
			shape.color = charNum < 4 ? colors[rndi(colors.length)] : "black";
			shape.scale = { scale: { x: rScale, y: rScale } };
		} else if (timePressed / 60 > 0) {
			notFinished = false;
			shape.color = "transparent";
		}
		
		timePressed = 0;
	}
	
	if (timePressed / 60 < 1) {
		placeBeg = "> ";
		skipBeg = "  ";
		finishBeg = "  ";
	} else if (timePressed / 60 < 3) {
		placeBeg = "  ";
		skipBeg = "> ";
		finishBeg = "  ";
	} else {
		placeBeg = "  ";
		skipBeg = "  ";
		finishBeg = "> ";
	}

	if (notFinished) {
		color("black");
		text(placeBeg + "PLACE", 4, 4);
		text(skipBeg + "SKIP", 4, 14);
		text(finishBeg + "FINISH", 4, 24);
	} else {
		end("");
	}
	

	shapes.forEach((s) => {
		color(s.color);
		console.log(s.scale);
		char(s.char, s.pos, s.scale);
	});

}
