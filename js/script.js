
alert(document.cookie);


let canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	startButton = document.getElementById('startButton'),
	menu = document.getElementById('menu'),
	fullScreenButton = document.getElementById('fullScreenButton'),
	leaderboardButton = document.getElementById('leaderboardButton'),
	infoButton = document.getElementById('infoButton'),
	difficultyRadio = document.getElementsByName('diff'),
	controlRadio = document.getElementsByName('control'),
	submitNameButton = document.getElementById('submitNameButton'),
	userNameInput = document.getElementById('userName'),
	gameInfo = document.getElementById('gameInfo');
	highscoreField = document.getElementById('highscoreField'),
	currentScoreField = document.getElementById('scoreField'),
	lifesField = document.getElementById('lifesField'),
	nameForm = document.getElementById('nameForm'),
	blockWrapper = document.getElementById('blockWrapper')
	greeting = document.getElementById('greeting');

let lastFrameTimeMs = 0,
	delta = 0;

let fullScreenEnabled = false,
	checkedDifficulty,
	checkedControl,
	startBall = false;
	ballOnPlatform = true;
	moreBonuses = false,
	bonusesEnabled = false,
	collision = false,
	lose = false;;

let ballRadius = innerWidth * 0.01,
	ballX,
	ballY,
	ballDx = 5,
	ballDy = -5;

const	colors = ['#0000ff', '#ff0000'],
		bonuses = ['addLife', 'slowDownBall', 'expandPlatform', 'stickBall'];

let bricks = [],
	brickRowCount,
	brickColumnCount,
	brickWidth,
	brickHeight,
	brickPadding = 2,
	brickMarginTop = Math.round(window.innerHeight * 0.1);

let platformWidth,
	platformHeight,
	extendedPlatformWidth = platformWidth * 2,
	platformX,
	platformY = window.innerHeight * 0.9,
	platformStep;

let rightPressed = false,
	leftPressed = false;


let player,
	userName;

let progressBarBonusHeight = 5,
	progressBarBonusWidth = window.innerWidth,
	progressBarBonusX = 0,
	progressBarBonusY = 0,
	progressBarBonusStep = 0.1;

let bonus = 'none',
	lifes,
	score = 0,
	tempHighscore = 0;


function Brick(brickX, brickY, color, row, column, hitsLeft, visability) {
    this.brickX = brickX;
    this.brickY = brickY;
    this.color = color;
    this.hitsLeft = hitsLeft;
    this.row = row;
    this.column = column;
    this.haveBonus = bonusesEnabled ? (moreBonuses ? (Math.round(Math.random() * 100) < 30 ? bonuses[Math.round(Math.random() * 3)] : 'none') 
    								: (Math.round(Math.random() * 100) < 10 ? bonuses[Math.round(Math.random() * 3)] : 'none')) : 'none';
    this.visability = visability;
    this.point = 10 * hitsLeft;
}

function Player(name, highscore, availableLevel) {
	this.name = name;
	this.highscore = highscore;
	this.availableLevel = availableLevel;
}


window.addEventListener('load', fullWindowCanvas);
window.addEventListener('load', checkCookies);
startButton.addEventListener('click', onStartGame);
document.addEventListener('keydown', keyPressedHandler);
document.addEventListener('keyup', keyReleasedHandler);
document.addEventListener('DOMContentLoaded', hideGameInfo);
submitNameButton.addEventListener('click', onNameSubmit);


window.onbeforeunload = updateCookies;

function checkCookies() {
	let playerHighScore = document.cookie.split(userName + '> ')[0].split('; ')[0];
	let playeravailableLevel = document.cookie.split(userName + '> ')[0].split('; ')[1];
	player = new Player(userName, playerHighScore);
}
function onNameSubmit() {
	nameForm.style.display = 'none';
	blockWrapper.style.display = 'none';
	userName = userNameInput.value.length == 0 ? 'smb who h8s to enter a names' : userNameInput.value;
	greeting.innerHTML = userName;
}


function onStartGame() {
	menu.style.display = 'none';
	checkedDifficulty = document.querySelector('input[name=diff]:checked').value;
	checkedControl = document.querySelector('input[name=control]:checked').value;
	switch (checkedDifficulty) {
		case 'easy':
			ballDx = 2;
			ballDy = -2;
			brickRowCount = 4;
			brickColumnCount = 8;
			moreBonuses = true;
			bonusesEnabled = true;
			lifes = 5;
			platformWidth = Math.round(window.innerWidth * 0.15);
			platformHeight = Math.round(window.innerHeight * 0.04);
			platformStep = 7;
			break;
		case 'normal':
			ballDx = 3;
			ballDy = -3;
			brickRowCount = 5;
			brickColumnCount = 10;
			moreBonuses = true;
			bonusesEnabled = true;
			lifes = 3;
			platformWidth = Math.round(window.innerWidth * 0.15);
			platformHeight = Math.round(window.innerHeight * 0.04);
			platformStep = 7;
			break;
		case 'hard':
			ballDx = 4;
			ballDy = -4;
			brickRowCount = 5;
			brickColumnCount = 10;
			moreBonuses = false;
			bonusesEnabled = true;
			lifes = 2;
			platformWidth = Math.round(window.innerWidth * 0.1);
			platformHeight = Math.round(window.innerHeight * 0.04);
			platformStep = 9;
			break;
		case 'impossible':
			ballDx = 5;
			ballDy = -5;
			brickRowCount = 6;
			brickColumnCount = 12;
			bonusesEnabled = false;
			lifes = 1;
			platformWidth = Math.round(window.innerWidth * 0.08);
			platformHeight = Math.round(window.innerHeight * 0.04);
			platformStep = 10;
			break;
	}
	brickWidth = Math.round(window.innerWidth / brickColumnCount);
	brickHeight = Math.round((window.innerHeight / brickRowCount) / 5);
	platformX = (window.innerWidth - platformWidth) / 2;
	gameInfo.style.display = 'flex';
	firstRoundBricksCompute();
	requestAnimationFrame(gameLoop);
}

function hideGameInfo() {
	gameInfo.style.display = 'none';
}

function firstRoundBricksCompute() {
	for (r = 0; r < brickRowCount; r++) {
	    bricks[r] = [];
	    for (c = 0; c < brickColumnCount; c++) {
	        bricks[r].push(new Brick(c*(brickWidth + brickPadding),
	                                 r*(brickHeight + brickPadding) + brickMarginTop,
	                                 (r == 0) ? colors[1] : colors[0],
	                                 r,
	                                 c,
	                                 (r == 0) ? 2 : 1,
	        						 true));
   		}
	}
}

function fullWindowCanvas() {
	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight);
}

function keyPressedHandler(btn) {
	if(btn.keyCode == 39) {
		rightPressed = true;
	} else if (btn.keyCode == 37) {
		leftPressed = true;
	}
}

function keyReleasedHandler(btn) {
	if(btn.keyCode == 39) {
		rightPressed = false;
	} else if (btn.keyCode == 37) {
		leftPressed = false;
	} else if (btn.keyCode == 32 && checkedControl == 'keyboard') {
		startBall = true;
	}
}

function mouseMoveHandler(mouse) {
	let cursorX = mouse.clientX;
	if (cursorX > platformWidth / 2 && cursorX < window.innerWidth - platformWidth / 2) {
		platformX = cursorX - platformWidth / 2;
		if (checkedControl == 'mouse') {
			canvas.addEventListener('click', () => {startBall = true;});
		}
	}
	if (!startBall){
		ballX = platformX + platformWidth / 2;
		ballY = platformY - ballRadius;
	}
}

function collisionDetection() {
    for (r = 0; r < brickRowCount; r++) {
        for (c = 0; c < brickColumnCount; c++) {
            let current = bricks[r][c];
            if (current.hitsLeft > 0) {
                if (ballX > current.brickX - ballRadius && ballX < current.brickX + brickWidth + ballRadius
                 && ballY > current.brickY - ballRadius && ballY < current.brickY + brickHeight + ballRadius) {
                    ballDy = -ballDy;
                    current.hitsLeft--;
                    collission = true;
                    if (current.hitsLeft == 1) {
                        current.color = colors[0];
                    }
                    if (current.haveBonus != "none") {
                        console.log('# ' + current.haveBonus);
                    }
                }
            }
        }
    }
    if (platformX > window.innerWidth - platformWidth) {
    	platformX = window.innerWidth - platformWidth;
    } else if (platformX < 0) {
    	platformX = 0;
    }
}

function computeScore() {
	let rowBonus = 0;
	for (r = 0; r < brickRowCount; r++) {
        for (c = 0; c < brickColumnCount; c++) {
        	if (bricks[r][c].hitsLeft == 0 && collission == true) {
                score += bricks[r][c].point;
                bricks[r][c].visability = false;
                collission = false;
        		console.log(score);
            }
         //    if (bricks[brickRowCount - 1][c].visability == false) {
         //    	rowBonus++;
         //    }
         //    if (rowBonus == brickColumnCount) {
         //    	score += 100;
        	// }
        }
    }
}

function bonusHandler() {

}

function drawBonusProgressBar() {
	context.beginPath();
	context.rect(progressBarBonusX, progressBarBonusY, progressBarBonusWidth, progressBarBonusHeight)
	context.fillStyle = '#ff0000';
	context.fill();
	context.closePath();
}

function gameInfoUpdate() {
	if (player.highscore < score) {
		player.highscore = score;
	}
	if (tempHighscore < score) {
		tempHighscore = score;
	}
	highscoreField.innerHTML = 'highscore: ' + player.highscore;
	currentScoreField.innerHTML = 'score: ' + score;
	lifesField.innerHTML =' ' + ' x ' + lifes;


}

function bonusUpdate(delta) {
	progressBarBonusX -= progressBarBonusStep * delta;
}

function platformReflexionHandler() {
	if (ballY > platformY - ballRadius) {
		if (ballX < platformX + platformWidth && ballX > platformX) {
			ballDy = -ballDy;
		}
	}
}

function trackControls() {
	if (checkedControl == 'keyboard') {
		if (rightPressed) {
			platformX += platformStep;
		} else if (leftPressed) {
			platformX -= platformStep;
		}
		if (!startBall){
			ballX = platformX + platformWidth / 2;
			ballY = platformY - ballRadius;
		}
	} else if (checkedControl == 'mouse'){
		document.addEventListener('mousemove', mouseMoveHandler);
		canvas.style.cursor = 'none';
	}
}

function moveBall(delta) {
	if (delta > 1000) {
		delta = 10;
	}
	delta /= 10;
	if(ballX + ballDx * delta > window.innerWidth - ballRadius || ballX + ballDx * delta < ballRadius) {
        ballDx = -ballDx;
    }
    if(ballY + ballDy * delta > window.innerHeight - ballRadius || ballY + ballDy * delta < ballRadius ) {
        ballDy = -ballDy;
    }
	ballX += ballDx * delta;
    ballY += ballDy * delta;
}

function drawBall() {
	context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = '#8080ff';
    context.fill();
    context.closePath();
}

function drawPlatform() {
	context.beginPath();
	context.rect(platformX, platformY, platformWidth, platformHeight);
	context.fillStyle = '#aaa';
	context.fill();
	context.closePath(); 
}

function drawBricks() {
    for (r = 0; r < brickRowCount; r++) {
		for (c = 0; c < brickColumnCount; c++) {
            if (bricks[r][c].hitsLeft > 0 && bricks[r][c].visability == true) {
                context.beginPath();
                context.rect(bricks[r][c].brickX, bricks[r][c].brickY, brickWidth, brickHeight);
                context.fillStyle = bricks[r][c].color;
                context.fill();
                context.closePath(); 
            }
        }
	}
}
function updateCookies() {
	document.cookie = username + '> ' + tempHighscore + '; ' + availableLevel
}
function update(delta) {
	trackControls();
	collisionDetection();
	platformReflexionHandler();
	computeScore();
	bonusUpdate(delta);
	gameInfoUpdate()
	if (startBall) {
		moveBall(delta);
	}
}

function render() {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	drawBonusProgressBar();
	drawBricks();
	drawBall();
	drawPlatform();
}

function gameLoop(timestamp) {
	delta = timestamp - lastFrameTimeMs;
	lastFrameTimeMs = timestamp;
	update(delta);
	render();
    requestAnimationFrame(gameLoop);
}
