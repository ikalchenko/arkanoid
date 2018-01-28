let canvas = document.getElementById("cnvs");
let ctx = canvas.getContext("2d");

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 100;
let dx = 2;
let dy = -2;
let interval = 1;

let brickWidth = 100;
let brickHeight = 20;
let brickPadding = 2;
let brickOffsetTop = 50;
let brickOffsetLeft = 10;
let brickRowCount = 2;//Math.round((canvas.height / 3) / (brickHeight + brickPadding));
let brickColumnCount = Math.round(canvas.width / (brickWidth + brickPadding));

//event LISTENERS

window.addEventListener("resize", resizeCanvas());


console.log(brickRowCount, brickColumnCount);

let bricks = [];
let colors = ["#0000ff", "#ff0000"];
let bonuses = ["life", "slow-down", "extend", "stick"];

function resizeCanvas() {
	canvas.setAttribute("width", innerWidth);
	canvas.setAttribute("height", innerHeight);
}

function Brick(brickX, brickY, color, hitsLeft) { //Brick object
    this.brickX = brickX;
    this.brickY = brickY;
    this.color = color;
    this.hitsLeft = hitsLeft;
    this.haveBonus = Math.round(Math.random() * 100) < 10 ? bonuses[Math.round(Math.random() * 3)] : "none";
    console.log(this.haveBonus);
}

function Player(lifes, complexity) {
    this.lifes = lifes;
	this.complexity = complexity;
	
}

for (r = 0; r < brickRowCount; r++) {
    bricks[r] = [];
    for (c = 0; c < brickColumnCount; c++) {
        bricks[r].push(new Brick((c*(brickWidth + brickPadding)) + brickOffsetLeft,
                                 (r*(brickHeight + brickPadding)) + brickOffsetTop,
                                 (r == 0) ? colors[1] : colors[0],
                                 (r == 0) ? 2 : 1));
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fill();
    ctx.closePath();
    x += dx;
    y += dy;
}

function drawBricks() {
    for (r = 0; r < brickRowCount; r++) {
		for (c = 0; c < brickColumnCount; c++) {
            if (bricks[r][c].hitsLeft > 0) {
                ctx.beginPath();
                ctx.rect(bricks[r][c].brickX, bricks[r][c].brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[r][c].color;
                ctx.fill();
                ctx.closePath();
            }
        }
	}
}

function collisionDetection() {
    for (r = 0; r < brickRowCount; r++) {
        for (c = 0; c < brickColumnCount; c++) {
            let current = bricks[r][c];
            if (current.hitsLeft > 0) {
                if (x > current.brickX && x < current.brickX + brickWidth
                 && y > current.brickY && y < current.brickY + brickHeight) {
                    dy = -dy;
                    current.hitsLeft--;
                    if (current.hitsLeft == 1) {
                        current.color = colors[0];
                    }
                    if (current.haveBonus != "none") {
                        console.log('☻ ' + current.haveBonus);
                    }
                 }
            }
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(); 
    drawBricks();
    collisionDetection();
}

setInterval(render, interval);