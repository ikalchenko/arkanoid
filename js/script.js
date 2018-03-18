class Player {
    constructor() {
        this.name = 'smb';
        this.life = 1;
        if (this.checkCookies()) {
            this.checkLocalStorage();
        } else {
            this.savePlayer();
        }
    }

    checkCookies() {
        return true;
    }

    checkLocalStorage() {

    }

    savePlayer() {

    }

    updateCookies() {

    }

    submitName() {

        if (ui.userNameInput.value === '') {
            this.name = 'smb who h8s 2 enter a names';
        } else {
            this.name = ui.userNameInput.value;
        }
        ui.greeting.innerText = this.name;
    }
}

class Config {
    constructor() {
        this.level = 1;
    }

    readPlayerConfig() {
        this.infinity = document.querySelector('input[name=infinity]:checked').value === 'infinityOn';
        this.control = document.querySelector('input[name=control]:checked').value;
        this.difficulty = document.querySelector('input[name=difficulty]:checked').value;
    }

    setXMLConfig(player, ball, platform) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'config/config.xml', false);
        xhr.send();
        let xml = xhr.responseXML;
        let configNodes = xml.children[0].children[0].children;
        for (let node of configNodes) {
            if (node.getAttribute('level') === this.difficulty) {
                ball.dx *= node.querySelector('ballDx').innerHTML;
                ball.dy *= node.querySelector('ballDy').innerHTML;
                this.brickRows = node.querySelector('brickRows').innerHTML;
                this.brickColumns = node.querySelector('brickColumns').innerHTML;
                this.bonusesEnabled = node.querySelector('bonusesEnabled').innerHTML;
                this.moreBonuses = node.querySelector('moreBonuses').innerHTML;
                player.life = node.querySelector('life').innerHTML;
                Platform.width *= node.querySelector('platformWidth').innerHTML;
                platform.step = node.querySelector('platformStep').innerHTML;
                break;

            }
        }
    }
}

//smth like interface, just for inheritance
class Drawable {
    constructor(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }

    draw() {
    }

    update() {
    }
}

class Brick extends Drawable {
    constructor(x, y, row, column, hitsLeft) {
        super(x, y);
        Brick.color = {
            ONE_HIT: '#0f0',
            TWO_HITS: '#00f',
            THREE_HITS: '#f00'
        };
        this.row = row;
        this.column = column;
        this.hitsLeft = hitsLeft;//game.config.infinity ? ((Math.random() * 100 < 30) ? 2 : 1) : (this.row === 0 ? 2 : 1);
        this.haveBonus = game.config.bonusesEnabled ? (game.config.moreBonuses ? (Math.round(Math.random() * 100) < 30 ? Bonus.getRandomBonusType() : 'none')
            : (Math.round(Math.random() * 100) < 10 ? Bonus.getRandomBonusType() : 'none')) : 'none';
        this.color = this.setBrickColor();
    }

    draw() {
        if (this.hitsLeft > 0) {
            ui.context.beginPath();
            ui.context.rect(this.x, this.y, Brick.width, Brick.height);
            ui.context.fillStyle = this.color;
            ui.context.fill();
            ui.context.closePath();
        }
    }

    update() {

    }


    setBrickColor() {
        switch (this.hitsLeft) {
            case 1:
                return Brick.color.ONE_HIT;
            case 2:
                return Brick.color.TWO_HITS;
            case 3:
                return Brick.color.THREE_HITS;
        }
    }

    static createBricks(rows, columns, level, infinityMode) {
        let bricks = [];
        for (let r = 0; r < rows; r++) {
            bricks[r] = [];
            for (let c = 0; c < columns; c++) {
                if (infinityMode){
                    bricks[r].push(new Brick(c * (Brick.width + Brick.margin),
                                            r * (Brick.height + Brick.margin) + Brick.topMargin,
                                            r,
                                            c,
                                            (Math.random() * 100 < 30) ? ((Math.random() * 100 < 30) ? 3 : 2) : 1));
                } else {
                    if (level === 1) {
                        bricks[r].push(new Brick(c * (Brick.width + Brick.margin),
                                                r * (Brick.height + Brick.margin) + Brick.topMargin,
                                                r,
                                                c,
                                                r < 2 ? (r === 0 ? 3 : 2) : 1));
                    }
                }
            }
        }
        return bricks;
    }
}

class Bonus extends Drawable {
    constructor() {
        super();
        Bonus.type = {
            AL: 'addLife',
            SDB: 'slowDownBall',
            EP: 'expandPlatform',
            SB: 'stickBall',
            DS: 'doubleScore'
        };
        Bonus.color = {
            ADD_LIFE: '#dc143c',
            SLOW_DOWN_BALL: '#f40',
            EXPAND_PLATFORM: '#2120ff',
            STICK_BALL: '#8a2be2',
            DOUBLE_SCORE: '#00ff47'
        };
    }

    static getRandomBonusType() {
        let rand = Math.round(Math.random() * 4);
        switch (rand) {
            case 0:
                return Bonus.type.AL;
            case 1:
                return Bonus.type.DS;
            case 2:
                return Bonus.type.EP;
            case 3:
                return Bonus.type.SB;
            case 4:
                return Bonus.type.SDB;
        }
    }

    draw() {

    }

    update() {

    }
}

class Platform extends Drawable {
    constructor(x, y, color) {
        super(x, y, 0, 0, color);
        Platform.width = window.innerWidth;
        Platform.height = Math.round(window.innerHeight * 0.03);
        this.step = 7;
    }

    draw() {
        ui.context.beginPath();
        ui.context.rect(this.x, this.y, Platform.width, Platform.height);
        ui.context.fillStyle = this.color;
        ui.context.fill();
        ui.context.closePath();

    }

    update(x, y) {
        if (ui.leftPressed) {
            if (this.x - this.step < 0) {
                this.x = 0;
            } else {
                this.x -= this.step;
            }
        }
        if (ui.rightPressed) {
            if (this.x + Platform.width + this.step >= window.innerWidth) {
                this.x = Math.round(window.innerWidth - Platform.width) + 1;
            } else {
                this.x += Number(this.step);
            }

        }
        if (x > Platform.width / 2 && x < window.innerWidth - Platform.width / 2) {
            this.x = x - Platform.width / 2;
        }
        //console.log('x: ' + this.x + ' step: ' + this.step + ' typeof x: ' + typeof this.x);
    }
}

class Ball extends Drawable {
    constructor(x, y, radius, delta, color) {
        super(x, y, delta, -delta, color === undefined ? Ball.getRandomColor() : color);
        this.radius = radius;
        this.onPlatform = false;
    }

    draw() {
        ui.context.beginPath();
        ui.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ui.context.fillStyle = this.color;
        ui.context.fill();
        ui.context.closePath();
    }

    update(delta) {
        if (this.onPlatform) {
            this.x = game.platform.x + Platform.width / 2;
            this.y = game.platform.y - this.radius;
        } else {
            let platformPart = Platform.width / 7;
            if (this.y + this.radius > game.platform.y && this.y - this.radius < game.platform.y + Platform.height) {
                if (this.x < game.platform.x + Platform.width && this.x > game.platform.x) {
                    this.dy = -this.dy;
                    switch (true) {
                        case this.x > game.platform.x && this.x < game.platform.x + platformPart:
                            this.dx = -delta * 1.5;
                            break;
                        case this.x > game.platform.x + platformPart && this.x < game.platform.x + platformPart * 2:
                            this.dx = -delta;
                            break;
                        case this.x > game.platform.x + platformPart * 2 && this.x < game.platform.x + platformPart * 3:
                            this.dx = -delta * 0.5;
                            break;
                        case this.x > game.platform.x + platformPart * 3 && this.x < game.platform.x + platformPart * 4:
                            this.dx = 0;
                            break;
                        case this.x > game.platform.x + platformPart * 4 && this.x < game.platform.x + platformPart * 5:
                            this.dx = delta * 0.5;
                            break;
                        case this.x > game.platform.x + platformPart * 5 && this.x < game.platform.x + platformPart * 6:
                            this.dx = delta;
                            break;
                        case this.x > game.platform.x + platformPart * 6 && this.x < game.platform.x + platformPart * 7:
                            this.dx = delta * 1.5;
                            break;
                    }

                } else if (this.x + this.radius > game.platform.x && this.x - this.radius < game.platform.x + Platform.width) {
                    this.dx = -this.dx;
                }
            }
            if (this.x + this.dx * delta > window.innerWidth - this.radius || this.x + this.dx * delta < this.radius) {
                this.dx = -this.dx;
            }
            if (this.y > window.innerHeight + 50 || this.y < this.radius) {
                this.dy = -this.dy;

            }
            this.x += this.dx * delta;
            this.y += this.dy * delta; // change to +=

        }

    }

    static getRandomColor() {
        let signs = '0123456789abcdef';
        let color = '#';
        let signIndex;
        for (let i = 0; i < 6; i++) {
            while (signIndex === undefined) {
                signIndex = Math.round(Math.random() * 15);
            }
            color += signs[signIndex];
            signIndex = undefined;
        }
        return color;
    }
}

class ProgressBar extends Drawable {
    constructor() {
        super();
    }

    draw() {

    }

    update() {

    }
}

class Game {
    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.player = new Player();
        this.timeDelta = Math.round(((innerWidth + innerHeight) / 2) * 0.003);
        this.lastFrameTime = 10;
        this.config = new Config();
        this.platform = new Platform(window.innerWidth / 2, window.innerHeight - 50, '#0aae0d', this.config.step);
        this.ball = new Ball(500, 500, 10, this.timeDelta);
        new Bonus(); //temporary
    }

    setup() {
        this.config.readPlayerConfig();
        this.config.setXMLConfig(this.player, this.ball, this.platform);
    }

    start() {
        this.bricks = Brick.createBricks(this.config.brickRows, this.config.brickColumns, this.config.level, this.config.infinity);
        requestAnimationFrame((timestamp) => this.loop(timestamp));
    }

    stop() {

    }

    pause() {

    }

    resume() {

    }

    collisionDetection() {
        for (let r = 0; r < this.config.brickRows; r++) {
            for (let c = 0; c < this.config.brickColumns; c++) {
                let currentBrick = this.bricks[r][c];
                if (currentBrick.hitsLeft > 0) {
                    if (game.ball.y + game.ball.radius > currentBrick.y && game.ball.y - game.ball.radius < currentBrick.y + Brick.height) {
                        if (game.ball.x + game.ball.radius > currentBrick.x && game.ball.x + game.ball.radius < currentBrick.x + Brick.width) {
                            game.ball.dy = -game.ball.dy;
                            currentBrick.hitsLeft--;
                            if (currentBrick.hitsLeft === 1) {
                                currentBrick.color = Brick.color.ONE_HIT;
                            }
                            if (currentBrick.hitsLeft === 2) {
                                currentBrick.color = Brick.color.TWO_HITS;
                            }
                        }
                    }
                }
            }
        }
    }

    update(delta) {
        this.ball.update(delta);
        this.platform.update();
        this.collisionDetection()
        ui.updateGameStat();
    }

    render() {
        ui.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ball.draw();
        for (let brickRow of this.bricks) {
            for (let brick of brickRow) {
                brick.draw();
            }
        }
        this.platform.draw();
    }

    loop(timestamp) {
        this.timeDelta = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        if (this.timeDelta > 1000) {
            this.timeDelta = 10;
        }
        this.timeDelta /= 10;
        this.update(this.timeDelta);
        this.render();
        requestAnimationFrame((timestamp) => this.loop(timestamp));
    }
}

class UI {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext('2d');
        this.startGameBtn = document.getElementById('startGameButton');
        this.menu = document.getElementById('menu');
        this.fullScreenButton = document.getElementById('fullScreenButton');
        this.leaderboardButton = document.getElementById('leaderboardButton');
        this.infoButton = document.getElementById('infoButton');
        this.infoBox = document.getElementById('infoBox');
        this.leaderboardBox = document.getElementById('leaderboardBox');
        this.submitNameButton = document.getElementById('submitNameButton');
        this.userNameInput = document.getElementById('userName');
        this.gameStat = document.getElementById('gameStat');
        this.nameForm = document.getElementById('nameForm');
        this.boxWrapper = document.getElementById('boxWrapper');
        this.greeting = document.getElementById('greeting');
        this.highscoreField = document.getElementById('highscoreField');
        this.scoreField = document.getElementById('scoreField');
        this.lifeField = document.getElementById('lifeField');
        this.gameNameField = document.getElementById('gameName');
        this.gameVersionField = document.getElementById('gameVersion');
        this.closeLeaderboardButton = document.getElementById('closeLeaderboardButton');
        this.closeInfoButton = document.getElementById('closeInfoButton');
        this.removeUserButton = document.getElementById('removeUserButton');
        this.changeUserButton = document.getElementById('changeUserButton');
        this.rightPressed = false;
        this.leftPressed = false;
        this.gameNameField.innerHTML = game.name;
        this.gameVersionField.innerHTML = 'v.' + game.version;
    }

    static switchFullScreen() {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            ui.fullScreenButton.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            ui.fullScreenButton.innerHTML = '<i class="fas fa-expand"></i>';
        }

    }

    showGameStat() {
        this.gameStat.style.display = 'flex';
    }

    updateGameStat() {
        this.highscoreField.innerText = 'highscore: ' + game.player.highscore;
        this.scoreField.innerText = 'score: ' + game.player.score;
        this.lifeField.innerText = 'x ' + game.player.life;
    }

    adapt() {
        Brick.width = Math.round(window.innerWidth / game.config.brickColumns);
        Brick.height = Math.round((window.innerWidth / game.config.brickRows) / 10);
        Brick.topMargin = Math.round(window.innerHeight * 0.1);
        Brick.margin = 2;
        ui.canvas.setAttribute('width', window.innerWidth);
        ui.canvas.setAttribute('height', window.innerHeight);
    }

    controlHandler(event) {
        if (this.menu.style.display === 'none') {
            if (game.config.control === 'mouse' && event !== undefined) {
                game.platform.update(Math.round(event.clientX));
            } else if (game.config.control === 'keyboard' && event !== undefined) {
                if (event.type === 'keydown' && event.keyCode === 39) {
                    this.rightPressed = true;
                }
                if (event.type === 'keydown' && event.keyCode === 37) {
                    this.leftPressed = true;
                }
                if (event.type === 'keyup' && event.keyCode === 39) {
                    this.rightPressed = false;
                }
                if (event.type === 'keyup' && event.keyCode === 37) {
                    this.leftPressed = false;
                }
            }
        }
    }

    showBox(invoker) {
        if (invoker === this.infoButton) {
            this.boxWrapper.style.display = 'block';
            this.infoBox.style.display = 'flex';
        }
        if (invoker === this.leaderboardButton) {
            this.boxWrapper.style.display = 'block';
            this.leaderboardBox.style.display = 'flex';
        }
        if (invoker === this.removeUserButton) {
            ui.userNameInput.value = '';
            this.boxWrapper.style.display = 'block';
            this.nameForm.style.display = 'flex';
            //removing player
        }
        if (invoker === this.changeUserButton) {
            //save last user to local storage
            ui.userNameInput.value = '';
            this.boxWrapper.style.display = 'block';
            this.nameForm.style.display = 'flex';
        }
    }

    start() {
        UI.hideBoxes(this.menu);
        this.showGameStat();
        game.setup();
        if (game.config.control === 'mouse') {
            this.canvas.style.cursor = 'none';
        }
        this.adapt();
        game.start();
    }

    submitName() {
        game.player.submitName();
        UI.hideBoxes(this.boxWrapper, this.nameForm);
    }

    static hideBoxes() {
        for (let i in arguments) {
            arguments[i].style.display = 'none';
        }
    }
}

let game = new Game('FAILOID', '0.3.2');
let ui = new UI();


window.onresize = () => ui.adapt();
ui.submitNameButton.addEventListener('click', () => ui.submitName());
ui.startGameBtn.addEventListener('click', () => ui.start());
ui.leaderboardButton.addEventListener('click', () => ui.showBox(ui.leaderboardButton));
ui.infoButton.addEventListener('click', () => ui.showBox(ui.infoButton));
ui.fullScreenButton.addEventListener('click', UI.switchFullScreen);
ui.canvas.addEventListener('click', () => x);
ui.closeLeaderboardButton.addEventListener('click', () => UI.hideBoxes(ui.boxWrapper, ui.leaderboardBox));
ui.closeInfoButton.addEventListener('click', () => UI.hideBoxes(ui.boxWrapper, ui.infoBox));
ui.removeUserButton.addEventListener('click', () => ui.showBox(ui.removeUserButton));
ui.changeUserButton.addEventListener('click', () => ui.showBox(ui.changeUserButton));
document.addEventListener('mousemove', (event) => ui.controlHandler(event));
document.addEventListener('keydown', (event) => ui.controlHandler(event));
document.addEventListener('keyup', (event) => ui.controlHandler(event));
document.addEventListener('keypress', (event) => ui.controlHandler(event));
