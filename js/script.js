let canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	fpsDisplay = document.getElementById('fpsDisplay');

let lastFrameTimeMs = 0,
	delta = 0;

let ballRadius = 10,
	ballX = canvas.width / 2,
	ballY = canvas.height / 2;

let	dx = 3,
	dy = 3;
	
const	gameDifficulty = ["easy", "normal", "hard", "impossible"],
		colors = ["#0000ff", "#ff0000"],
		bonuses = ["life", "slow-down", "extend", "stick"];

let bricks = [];
let brickWidth,
	brickHeight,
	brickPadding = 2;

window.addEventListener('load', fullWindowCanvas());

function fullWindowCanvas() {
	canvas.setAttribute("width", innerWidth);
	canvas.setAttribute("height", innerHeight);
}

function Brick(brickX, brickY, color, hitsLeft) {
    this.brickX = brickX;
    this.brickY = brickY;
    this.color = color;
    this.hitsLeft = hitsLeft;
    this.haveBonus = Math.round(Math.random() * 100) < 10 ? bonuses[Math.round(Math.random() * 3)] : "none";
}

function Player(lifes, difficulty ) {
    this.lifes = lifes;
	this.difficulty  = difficulty ;
	
}

// for (let r = 0; r < brickRowCount; r++) {
//     bricks[r] = [];
//     for (let c = 0; c < brickColumnCount; c++) {
//         bricks[r].push(new Brick((c*(brickWidth + brickPadding)) + brickOffsetLeft,
//                                  (r*(brickHeight + brickPadding)) + brickOffsetTop,
//                                  (r == 0) ? colors[1] : colors[0],
//                                  (r == 0) ? 2 : 1));
//     }
// }

function update(delta) {
	if (delta > 1000) {
		delta = 10;
	}
	delta /= 10;
	if(ballX + dx * delta > canvas.width || ballX + dx * delta < ballRadius) {
        dx = -dx;
    }
    if(ballY + dy * delta > canvas.height || ballY + dy * delta < ballRadius ) {
        dy = -dy;
    }
	ballX += dx * delta;
    ballY += dy * delta;
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
}

function drawBall() {
	context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    
    context.fillStyle = '#8080ff';
    context.fill();
    context.closePath();
}

function gameLoop(timestamp) {
	delta = timestamp - lastFrameTimeMs;
	lastFrameTimeMs = timestamp;
	update(delta);
	render();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
