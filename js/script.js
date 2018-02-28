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
	currentBrickScoreField = document.getElementById('scoreField'),
	lifesField = document.getElementById('lifesField'),
	nameForm = document.getElementById('nameForm'),
	blockWrapper = document.getElementById('blockWrapper'),
	greeting = document.getElementById('greeting'),
	closeLeaderboardButton = document.getElementById('closeLeaderboardButton'),
	closeInfoButton = document.getElementById('closeInfoButton'),
	infoBox = document.getElementById('info'),
	leaderboardBox = document.getElementById('leaderboard'),
	infinityModeRadio = document.getElementsByName('infinityMode'),
	changeUserButton = document.getElementById('changeUser'),
	winBox = document.getElementById('winBox'),
	winScoreField = document.getElementById('winScoreField'),
	closeWinBoxButton = document.getElementById('closeWinBoxButton');

	//TODO
	//при выпадении двух бонусво подряд цвет присваивается одинаковый????
	//переписать циклы обновления кирпичей в бесконечном режиме без внутренних цыклов

let lastFrameTimeMs = 0,
	timeDelta = 0,
	delta = Math.round(((innerWidth + innerHeight) / 2) * 0.03);
	delta = Math.round(((innerWidth + innerHeight) / 2) * 0.008);

let fullScreenEnabled = false,
	checkedDifficulty,
	checkedControl,
	startBall = false,
	ballOnPlatform = true,
	moreBonuses = false,
	bonusesEnabled = false,
	collision = false,
	lose = false;

let addedRow = false;

let reqAnimFrame;

let ballRadius = ((innerWidth + innerHeight) / 2) * 0.01,
	ballX,
	ballY,
	ballDx = delta,
	ballDy = -delta;

const	brickColors = ['blue', 'red'],
		bonusTypes = ['addLife', 'slowDownBall', 'expandPlatform', 'stickBall', 'doubleScore'],
		bonusColors = ['red', 'violet', 'blue', 'orange', 'green'];

let bricks = [],
	bonuses = [],
	brickRowCount,
	brickColumnCount,
	brickWidth,
	brickHeight,
	brickPadding = 2,
	brickMarginTop = Math.round(window.innerHeight * 0.1);

let platformWidth,
	platformHeight,
	platformX,
	platformY = window.innerHeight * 0.9,
	platformStep,
	platformPart;

let rightPressed = false,
	leftPressed = false;


let player,
	userName;

let progressBarBonusHeight = 5,
	progressBarBonusWidth = window.innerWidth,
	progressBarX = 0,
	progressBarY = 0,
	progressBarBonusStep = 0.1;

let bonusDx = delta,
	bonusDy = delta,
	bonusWidth,
	bonusHeight,
	lifes,
	score = 0,
	tempHighscore = 0,
	infinityMode = false,
	bricksInRowDestroyed = [0, 0, 0, 0, 0, 0];

class Brick {
	constructor(x, y, hitsLeft, row, column, onceHitted) {
	    this.x = x;
	    this.y = y;
	    this.hitsLeft = hitsLeft;
	    this.color = hitsLeft === 2 ? brickColors[1] : brickColors[0];
	    this.row = row;
	    this.column = column;
	    this.haveBonus = bonusesEnabled ? (moreBonuses ? (Math.round(Math.random() * 100) < 30 ? bonusTypes[Math.round(Math.random() * 5)] : 'none') 
	    								: (Math.round(Math.random() * 100) < 10 ? bonusTypes[Math.round(Math.random() * 5)] : 'none')) : 'none';
	    this.point = hitsLeft * 10;
	    this.onceHitted = onceHitted;
	}
}

class Player {
	constructor(name, highscore, availableLevel) {
		this.name = name;
		this.highscore = highscore;
		this.availableLevel = availableLevel;
	}
}

class Bonus {
	constructor(type, x, y, knockedOut, active) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.knockedOut = knockedOut;
		this.active = active;
		this.color = setBonusColor(this);
	}	
}

submitNameButton.addEventListener('click', checkCookies);
changeUserButton.addEventListener('click', changeUser);
startButton.addEventListener('click', onStartGame);
document.addEventListener('keydown', keyPressedHandler);
document.addEventListener('keyup', keyReleasedHandler);
submitNameButton.addEventListener('click', onNameSubmit);
closeInfoButton.addEventListener('click', hideBox);
closeLeaderboardButton.addEventListener('click', hideBox);
infoButton.addEventListener('click', showInfoBox);
leaderboardButton.addEventListener('click', showLeaderboardBox);
closeWinBoxButton.addEventListener('click', hideBox);


function checkCookies() {}

function setBonusColor(bonus) {
	switch(bonus.type){
		case 'addLife':
			return bonusColors[0];
		case 'slowDownBall':
			return bonusColors[1];
		case 'expandPlatform':
			return bonusColors[2];
		case 'stickBall':
			return bonusColors[3];
		case 'doubleScore':
				return bonusColors[4];
	}
}

function onNameSubmit() {
	nameForm.style.display = 'none';
	blockWrapper.style.display = 'none';
	userName = userNameInput.value.length == 0 ? 'smb who h8s 2 enter a names' : userNameInput.value;
	greeting.innerHTML = userName; 
}

function onStartGame() {
	fullWindowCanvas();
	player = new Player('smb', 577, 1);
	menu.style.display = 'none';
	checkedDifficulty = document.querySelector('input[name=diff]:checked').value;
	checkedControl = document.querySelector('input[name=control]:checked').value;
	infinityMode = document.querySelector('input[name=infinityMode]:checked').value == 'infinityOn' ? true : false;
	switch (checkedDifficulty) {
		case 'easy':
			brickRowCount = 4;
			brickColumnCount = 8;
			moreBonuses = true;
			bonusesEnabled = true;
			lifes = 5;
			platformWidth = Math.round(window.innerWidth * 0.15);
			platformStep = 7;
			break;
		case 'normal':
			ballDx *= 1.2;
			ballDy *= 1.2;
			brickRowCount = 5;
			brickColumnCount = 10;
			moreBonuses = true;
			bonusesEnabled = true;
			lifes = 3;
			platformWidth = Math.round(window.innerWidth * 0.15);
			platformStep = 7;
			break;
		case 'hard':
			ballDx *= 1.5;
			ballDy *= 1.5;
			brickRowCount = 5;
			brickColumnCount = 10;
			moreBonuses = false;
			bonusesEnabled = true;
			lifes = 2;
			platformWidth = Math.round(window.innerWidth * 0.1);
			platformStep = 9;
			break;
		case 'impossible':
			ballDx *= 2;
			ballDy *= 2;
			brickRowCount = 6;
			brickColumnCount = 12;
			moreBonuses = false;
			bonusesEnabled = false;
			lifes = 1;
			platformWidth = Math.round(window.innerWidth * 0.08);
			platformStep = 10;
			break;
	}
	platformHeight = Math.round(window.innerHeight * 0.03);
	brickWidth = Math.round(window.innerWidth / brickColumnCount);
	brickHeight = Math.round((window.innerHeight / brickRowCount) / 5);
	platformX = (window.innerWidth - platformWidth) / 2;
	bonusWidth = brickWidth / 4;
	bonusHeight = brickHeight / 2;
	gameInfo.style.display = 'flex';
	computeBricks();
	reqAnimFrame = requestAnimationFrame(gameLoop);
}

function onLose() {
	
}

function onWin() {
	blockWrapper.style.display = 'block';
	winBox.style.display = 'flex';
	winScoreField.innerHTML = score;
	cancleAnimationFrame(reqAnimFrame);
	
}

function firstRoundBricksCompute() {
	for (let r = 0; r < brickRowCount; r++) {
	    bricks[r] = [];
	    for (let c = 0; c < brickColumnCount; c++) {
	        bricks[r].push(new Brick(c * (brickWidth + brickPadding),
	                                 r * (brickHeight + brickPadding) + brickMarginTop,
	                                 r == 0 ? 2 : 1,
	                                 r,
	                                 c,
	                                 false));
   		}
	}
}

function infinityModeBricksCompute () {
	for (let r = 0; r < brickRowCount; r++) {
	    bricks[r] = [];
	    for (let c = 0; c < brickColumnCount; c++) {
	        bricks[r].push(new Brick(c * (brickWidth + brickPadding),
	                                 r * (brickHeight + brickPadding) + brickMarginTop,
	                                 (Math.random() * 100 < 30) ? 2 : 1,
	                                 r,
	                                 c, 
	                                 false));
   		}
	}
}

function computeBricks() {
	if (infinityMode){
		infinityModeBricksCompute();
	} else {
		firstRoundBricksCompute();
	}
}

function updateBricksInfinityMode() {

	for(let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            if (bricks[r][c].hitsLeft === 0 && bricks[r][c].onceHitted === true) {
                bricksInRowDestroyed[r]++;
                bricks[r][c].onceHitted = false;
            }
            if (bricksInRowDestroyed[r] === brickColumnCount && addedRow === false) {
                bricks.unshift(getRandomBrickRow());
                addedRow = true;

            }
        }
    }
}

function changeUser() {
	nameForm.style.display = 'flex';
	blockWrapper.style.display = 'block';
}

function getRandomBrickRow() {
	let arr = [];
    for (let i = 0; i < brickColumnCount; i++) {
    	arr.push(new Brick(i * (brickWidth + brickPadding),
                        brickMarginTop,
                        (Math.random() * 100 < 30) ? 2 : 1,
                        0,
                        i,
                        false));
    }
    return arr;
}

function shiftBricks() {
	for (let i = 0; i < brickRowCount; i++) {


	}
}

function hideBox() {
	blockWrapper.style.display = 'none';
	infoBox.style.display = 'none';
	leaderboardBox.style.display = 'none';
	winBox.style.display = 'none';
}

function showInfoBox() {
	blockWrapper.style.display = 'block';
	infoBox.style.display = 'flex';
}

function showLeaderboardBox() {
	blockWrapper.style.display = 'block';
	leaderboardBox.style.display = 'flex';
}

function fullWindowCanvas() {
	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight);
}

function keyPressedHandler(btn) {
	if(btn.keyCode === 39) {
		rightPressed = true;
	} else if (btn.keyCode === 37) {
		leftPressed = true;
	}
}

function keyReleasedHandler(btn) {
	if(btn.keyCode === 39) {
		rightPressed = false;
	} else if (btn.keyCode === 37) {
		leftPressed = false;
	} else if (btn.keyCode === 32 && checkedControl === 'keyboard') {
		startBall = true;
	}
}

function mouseMoveHandler(event) {
	let cursorX = event.clientX;
	if (cursorX > platformWidth / 2 && cursorX < window.innerWidth - platformWidth / 2) {
		platformX = cursorX - platformWidth / 2;
		if (checkedControl === 'mouse') {
			canvas.addEventListener('click', function () {startBall = true;});
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
            let currentBrick = bricks[r][c];
            if (currentBrick.hitsLeft > 0){
            	if (ballY + ballRadius > currentBrick.y && ballY - ballRadius < currentBrick.y + brickHeight) {
            		if (ballX + ballRadius > currentBrick.x && ballX - ballRadius < currentBrick.x + brickWidth) {
            			ballDy =  -ballDy;
            			currentBrick.hitsLeft--;
            			if (currentBrick.haveBonus !== 'none' && currentBrick.hitsLeft === 0) {
            				bonuses.push(new Bonus(currentBrick.haveBonus,
            				 						currentBrick.x + brickWidth * 0.125 * 3,
            				  						currentBrick.y + brickHeight,
            				  						true,
            				  						false));
						}
						collission = true;
						currentBrick.onceHitted = true;
						if (currentBrick.hitsLeft === 1) {
							currentBrick.color = brickColors[0];
						}
					} else if (ballX + ballRadius > currentBrick.x && ballX - ballRadius < currentBrick.x + brickWidth) {
						ballDx =  -ballDx;
						currentBrick.hitsLeft--;
						if (currentBrick.haveBonus !== 'none' && currentBrick.hitsLeft === 0) {
							bonuses.push(new Bonus(currentBrick.haveBonus,
            				 						currentBrick.x + brickWidth,
            				  						currentBrick.y + brickWidth * 0.125 * 3,
							  						true,
													false));
						}
						collission = true;
						if (currentBrick.hitsLeft === 1) {
							currentBrick.color = brickColors[0];
						}
					}
            	}
            }
        }
    }
}

function computeScore() {
	for (r = 0; r < brickRowCount; r++) {
        for (c = 0; c < brickColumnCount; c++) {
        	let currentBrick = bricks[r][c];
        	if (currentBrick.hitsLeft === 0 && collission === true) {
                score += currentBrick.point;
                collission = false;
        		console.log(score);
            }
        }
    }
}

function bonusHandler() {
	for (let current in bonuses) {
		if (bonuses[current].active) {
			switch (bonus.type) {
				case 'addLife':
					lifes++;
					break;
				case 'slowDownBall':
					ballDx *= 0.5;
					ballDy *= 0.5;
					break;
				case 'expandPlatform':
					platformWidth *= 1.5;
					break;
				case 'stickBall':
					startBall = false;
					break;
				case 'doubleScore':
					score *= 2;
					break;
			}
		}
	}
}

function clearBonuses() {
	for (let current in bonuses) {
		if (bonuses[current].y > window.innerHeight) {
			bonuses.splice(current, 1);
		}
	}
}

function updateBonusFall(timeDelta) {
	if (timeDelta > 1000) {
		timeDelta = 10;
	}
	timeDelta /= 10;
	for (let current in bonuses) {
		if (bonuses[current].knockedOut) {
			bonuses[current].y += bonusDy * timeDelta;
		}
	}
}

function drawBonusFall() {
	context.beginPath();
	for (let current in bonuses) {
		if (bonuses[current].knockedOut) {
			context.rect(bonuses[current].x, bonuses[current].y, bonusWidth, bonusHeight);
			context.fillStyle = bonuses[current].color;
		}
	}
	context.fill();
	context.closePath();
}

function drawBonusProgressBar() {
	context.beginPath();
	context.rect(progressBarX, progressBarY, progressBarBonusWidth, progressBarBonusHeight)
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
	currentBrickScoreField.innerHTML = 'score: ' + score;
	lifesField.innerHTML ='x ' + lifes;
}

function bonusProgressBarUpdate(timeDelta) { 
	progressBarX -= progressBarBonusStep * timeDelta;
}

function catchBonusHandler() {
	for (let current in bonuses) {
		if (bonuses[current].x < platformX + platformWidth && bonuses[current].x > platformX) {
			if (bonuses[current].y > platformY  && bonuses[current].y < platformY + platformHeight)
				bonuses[current].active = true;
		}
	}
}

function platformReflexionHandler() {
	platformPart = platformWidth / 7;
	if (ballY + ballRadius > platformY && ballY - ballRadius < platformY + platformHeight) {
		if (ballX < platformX + platformWidth && ballX > platformX) {
			ballDy = -ballDy;
			switch (true) {
				case ballX > platformX && ballX < platformX + platformPart:
					ballDx = -delta * 1.5;
					break;
				case ballX > platformX + platformPart && ballX < platformX + platformPart * 2:
					ballDx = -delta;
					break;
				case ballX > platformX + platformPart * 2 && ballX < platformX + platformPart * 3:
					ballDx = -delta * 0.5;
					break;
				case ballX > platformX + platformPart * 3 && ballX < platformX + platformPart * 4:
					ballDx = 0;
					break;
				case ballX > platformX + platformPart * 4 && ballX < platformX + platformPart * 5:
					ballDx = delta * 0.5;
					break;
				case ballX > platformX + platformPart * 5 && ballX < platformX + platformPart * 6:
					ballDx = delta;
					break;
				case ballX > platformX + platformPart * 6 && ballX < platformX + platformPart * 7:
					ballDx = delta * 1.5;
					break;
			}
			
		} else if (ballX + ballRadius > platformX && ballX - ballRadius < platformX + platformWidth) {
			ballDx = -ballDx;
		}
	}
}

function trackControls() {
	if (checkedControl === 'keyboard') {
		if (rightPressed) {
			platformX += platformStep;
		} else if (leftPressed) {
			platformX -= platformStep;
		}
		if (!startBall){
			ballX = platformX + platformWidth / 2;
			ballY = platformY - ballRadius;
		}
	} else if (checkedControl === 'mouse'){
		document.addEventListener('mousemove', mouseMoveHandler);
		canvas.style.cursor = 'none';
	}
	if (platformX > window.innerWidth - platformWidth) {
    	platformX = window.innerWidth - platformWidth;
    } else if (platformX < 0) {
    	platformX = 0;
    }
}

function updateBrickRowCount() {}

function isBricksVisible() {
	for (let r = 0; r < brickRowCount; r++){
		for (let c = 0; c < brickColumnCount; c++) {
			let currentBrick = bricks[r][c];
			if (currentBrick.hitsLeft !== 0) {
				return true;
			}
		}
	}
	return false;
}

function moveBall(timeDelta) {
	if (timeDelta > 1000) {
		timeDelta = 10;
	}
	timeDelta /= 10;
	if (startBall) {
		if(ballX + ballDx * timeDelta > window.innerWidth - ballRadius || ballX + ballDx * timeDelta < ballRadius) {
	        ballDx = -ballDx;
	    }
	    if(ballY + ballDy * timeDelta > window.innerHeight - ballRadius || ballY + ballDy * timeDelta < ballRadius ) {
	        ballDy = -ballDy;
	    }
		ballX += ballDx * timeDelta;
	    ballY += ballDy * timeDelta;
	}
}

function drawBall() {
	context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = '#8058ff';
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
			let currentBrick = bricks[r][c];
            if (currentBrick.hitsLeft > 0) {
                context.beginPath();
                context.rect(currentBrick.x, currentBrick.y, brickWidth, brickHeight);
                context.fillStyle = currentBrick.color;
                context.fill();
                context.closePath(); 
            }
        }
	}
}

function updateCookies() {}

function update(timeDelta) {
	trackControls();
	collisionDetection();
	platformReflexionHandler();
	computeScore();
	if(!(isBricksVisible())) {
		onWin();
	}
	clearBonuses();
	if (infinityMode) {
		updateBricksInfinityMode();
	}
	updateBonusFall(timeDelta);
	gameInfoUpdate();
	moveBall(timeDelta);
	bonusHandler();
}

function render() {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);
	drawBricks();
	drawPlatform();
	drawBall();
	drawBonusFall();
}

function gameLoop(timestamp) {
	timeDelta = timestamp - lastFrameTimeMs;
	lastFrameTimeMs = timestamp;
	update(timeDelta);
	render();
    requestAnimationFrame(gameLoop);
}
