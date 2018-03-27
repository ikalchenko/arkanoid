class Score {
    constructor(score) {
        if (score !== undefined) {
            this.highscore = score.highscore;
        } else {
            this.highscore = {
                infinity: {
                    easy: 0,
                    normal: 0,
                    hard: 0,
                    impossible: 0
                },
                regular: {
                    easy: 0,
                    normal: 0,
                    hard: 0,
                    impossible: 0
                }
            };
        }
        this.currentScore = {
            infinity: {
                easy: 0,
                normal: 0,
                hard: 0,
                impossible: 0
            },
            regular: {
                easy: 0,
                normal: 0,
                hard: 0,
                impossible: 0
            }
        };
    }

    static getHighscore(player) {
        if (game.config.infinity) {
            switch (game.config.difficulty) {
                case Config.difficulties.EASY:
                    return  player.score.highscore.infinity.easy;
                case Config.difficulties.NORMAL:
                    return  player.score.highscore.infinity.normal;
                case Config.difficulties.HARD:
                    return  player.score.highscore.infinity.hard;
                case Config.difficulties.IMPOSSIBLE:
                    return  player.score.highscore.infinity.impossible;
            }
        } else {
            switch (game.config.difficulty) {
                case Config.difficulties.EASY:
                    return  player.score.highscore.regular.easy;
                case Config.difficulties.NORMAL:
                    return  player.score.highscore.regular.normal;
                case Config.difficulties.HARD:
                    return  player.score.highscore.regular.hard;
                case Config.difficulties.IMPOSSIBLE:
                    return  player.score.highscore.regular.impossible;
            }
        }
    }
    
    static getScore(player) {
        if (game.config.infinity) {
            switch (game.config.difficulty) {
                case Config.difficulties.EASY:
                    return  player.score.currentScore.infinity.easy;
                case Config.difficulties.NORMAL:
                    return  player.score.currentScore.infinity.normal;
                case Config.difficulties.HARD:
                    return  player.score.currentScore.infinity.hard;
                case Config.difficulties.IMPOSSIBLE:
                    return  player.score.currentScore.infinity.impossible;
            }
        } else {
            switch (game.config.difficulty) {
                case Config.difficulties.EASY:
                    return  player.score.currentScore.regular.easy;
                case Config.difficulties.NORMAL:
                    return  player.score.currentScore.regular.normal;
                case Config.difficulties.HARD:
                    return  player.score.currentScore.regular.hard;
                case Config.difficulties.IMPOSSIBLE:
                    return  player.score.currentScore.regular.impossible;
            }
        }
    }

    doubleScore() {
        if (game.config.infinity) {
            switch (game.config.difficulty) {
                case Config.difficulties.EASY:
                    this.currentScore.infinity.easy *= 2;
                    break;
                case Config.difficulties.NORMAL:
                    this.currentScore.infinity.normal *= 2;
                    break;
                case Config.difficulties.HARD:
                    this.currentScore.infinity.hard *= 2;
                    break;
                case Config.difficulties.IMPOSSIBLE:
                    this.currentScore.infinity.impossible *= 2;
                    break;
            }
        } else {
            switch (game.config.difficulty) {
                case Config.difficulties.EASY:
                    this.currentScore.regular.easy *= 2;
                    break;
                case Config.difficulties.NORMAL:
                    this.currentScore.regular.normal *= 2;
                    break;
                case Config.difficulties.HARD:
                    this.currentScore.regular.hard *= 2;
                    break;
                case Config.difficulties.IMPOSSIBLE:
                    this.currentScore.regular.impossible *= 2;
                    break;
            }
        }
    }

    update(points, config) {
        if (config.infinity) {
            switch (config.difficulty) {
                case 'easy': 
                    this.currentScore.infinity.easy += points;
                    if (this.highscore.infinity.easy < this.currentScore.infinity.easy) {
                        this.highscore.infinity.easy = this.currentScore.infinity.easy;
                    }
                    break;
                case 'normal':
                    this.currentScore.infinity.normal += points;
                    if (this.highscore.infinity.normal < this.currentScore.infinity.normal) {
                        this.highscore.infinity.normal = this.currentScore.infinity.normal;
                    }
                    break;
                case 'hard':
                    this.currentScore.infinity.hard += points;
                    if (this.highscore.infinity.hard < this.currentScore.infinity.hard) {
                        this.highscore.infinity.hard = this.currentScore.infinity.hard;
                    }
                    break;
                case 'impossible':
                    this.currentScore.infinity.impossible += points;
                    if (this.highscore.infinity.impossible < this.currentScore.infinity.impossible) {
                        this.highscore.infinity.impossible = this.currentScore.infinity.impossible;
                    }
                    break;
            }
        } else {
            switch (config.difficulty) {
                case 'easy':
                    this.currentScore.regular.easy += points;
                    if (this.highscore.regular.easy < this.currentScore.regular.easy) {
                        this.highscore.regular.easy = this.currentScore.regular.easy;
                    }
                    break;
                case 'normal':
                    this.currentScore.regular.normal += points;
                    if (this.highscore.regular.normal < this.currentScore.regular.normal) {
                        this.highscore.regular.normal = this.currentScore.regular.normal;
                    }
                    break;
                case 'hard':
                    this.currentScore.regular.hard += points;
                    if (this.highscore.regular.hard < this.currentScore.regular.hard) {
                        this.highscore.regular.hard = this.currentScore.regular.hard;
                    }
                    break;
                case 'impossible':
                    this.currentScore.regular.impossible += points;
                    if (this.highscore.regular.impossible < this.currentScore.regular.impossible) {
                        this.highscore.regular.impossible = this.currentScore.regular.impossible;
                    }
                    break;
            }

        }

    }
}

class Player {
    constructor(storedPlayer, name) {
        if (storedPlayer === null) {
            this.name = name;
            this.life = 1;
            this.timeInGame = 0;
            this.availableLevel = 1;
            this.score = new Score();
        } else {
            this.name = storedPlayer.name;
            this.life = storedPlayer.life;
            this.timeInGame = storedPlayer.timeInGame;
            this.availableLevel = storedPlayer.availableLevel;
            this.score = new Score(storedPlayer.score);
            this.timer = new Timer();
        }

    }

    serialize() {
        this.life = null;
        localStorage.setItem(this.name, JSON.stringify(this));
    }

    update() {
        this.timeInGame += this.timer.getSecond();
        if (game.ball.lost) {
            this.life--;
        }
    }
}

class Timer {
    constructor(duration) {
        this.duration = duration;
        this.timeLeft = this.duration;
        this.timestamp = Date.now();
        this.stopped = false;
        this.update();
    }

    update() {
        if (Date.now() - this.timestamp >= 1000) {
            this.timeLeft--;
            this.timestamp = Date.now();
        }
        if (this.timeLeft <= 0) {
            this.stopped = true;
        }
    }

    getSecond() {
        if (Date.now() - this.timestamp >= 1000) {
            this.timestamp = Date.now();
            return 1;
        } else return 0;
    }
    static getMinutesAndSeconds(sec) {
        let mins = Math.trunc(sec / 60);
        let secs = Math.round(sec % 60);
        if (secs / 10 < 1) {
            secs = '0' + secs;
        }
        return mins + ':' + secs;

    }
}

class Config {
    constructor() {
        Config.difficulties = {
            EASY: 'easy',
            NORMAL: 'normal',
            HARD: 'hard',
            IMPOSSIBLE: 'impossible'
        };
        this.level = 1;
    }

    readPlayerConfig() {
        this.infinity = document.querySelector('input[name=infinity]:checked').value === 'infinityOn';
        this.control = Config.mobile ? 'touch' : document.querySelector('input[name=control]:checked').value;
        this.difficulty = document.querySelector('input[name=difficulty]:checked').value;
        if (this.infinity) {
            Brick.bricksInRowDestroyed = [0, 0, 0, 0, 0, 0];
        }
    }

    setXMLConfig(ball) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'config/config.xml', false);
        xhr.send();
        let xml = xhr.responseXML;
        let configNodes = xml.children[0].children[0].children;
        for (let node of configNodes) {
            if (node.getAttribute('level') === this.difficulty) {
                ball.dx *= Number(node.querySelector('ballDx').innerHTML);
                ball.dy *= Number(node.querySelector('ballDy').innerHTML);
                this.brickRows = Number(node.querySelector('brickRows').innerHTML);
                this.brickColumns = Number(node.querySelector('brickColumns').innerHTML);
                this.bonusesEnabled = node.querySelector('bonusesEnabled').innerHTML === 'true';
                this.moreBonuses = node.querySelector('moreBonuses').innerHTML === 'true';
                this.playerLife = Number(node.querySelector('life').innerHTML);
                this.platformWidthMultiplier = Number(node.querySelector('platformWidth').innerHTML);
                this.platformStep = Number(node.querySelector('platformStep').innerHTML);
                this.bonusDuration = Number(node.querySelector('bonusDuration').innerHTML);
                break;
            }
        }
    }
}

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
        Brick.colors = {
            ONE_HIT: '#0f0',
            TWO_HITS: '#00f',
            THREE_HITS: '#f00'
        };
        this.row = row;
        this.column = column;
        this.hitsLeft = hitsLeft;
        this.points = this.hitsLeft * 10;
        this.haveBonus = Bonus.getBonus();
        this.color = this.setBrickColor();
        this.destroyed = false;
    }

    draw() {
        if (this.hitsLeft > 0) {
            ui.context.beginPath();
            ui.context.rect(this.x, this.y, Brick.width, Brick.height);
            ui.context.fillStyle = this.color;
            ui.context.lineWidth = 4;
            ui.context.strokeStyle = '#eee';
            ui.context.stroke();
            ui.context.fill();
            ui.context.closePath();
        }
    }

    static updateInfinity() {
        for (let r = 0; r < game.config.brickRows; r++) {
            for (let c = 0; c < game.config.brickColumns; c++) {
                if (game.bricks[r][c].hitsLeft <= 0 && !game.bricks[r][c].destroyed) {
                    Brick.bricksInRowDestroyed[r]++;
                    game.bricks[r][c].destroyed = true;
                }
                if (Brick.bricksInRowDestroyed[r] >= game.config.brickColumns) {
                    game.bricks.splice(r, 1);
                    game.bricks.unshift(Brick.getRandomBrickRow());
                    Brick.bricksInRowDestroyed.splice(r, 1);
                    Brick.bricksInRowDestroyed.unshift(0);
                    Brick.recalculateCoordinates();
                }
            }
        }
    }

    static getRandomBrickRow() {
        let bricks = [];
        for (let c = 0; c < game.config.brickColumns; c++) {
            bricks.push(new Brick(c * (Brick.width + Brick.margin),
                0 + Brick.topMargin,
                0,
                c,
                (Math.random() * 100 < 30) ? ((Math.random() * 100 < 30) ? 3 : 2) : 1));
        }
        return bricks;
    }

    setBrickColor() {
        switch (this.hitsLeft) {
            case 1:
                return Brick.colors.ONE_HIT;
            case 2:
                return Brick.colors.TWO_HITS;
            case 3:
                return Brick.colors.THREE_HITS;
        }
    }

    static createBricks(rows, columns, level, infinityMode) {
        let bricks = [];
        for (let r = 0; r < rows; r++) {
            bricks[r] = [];
            for (let c = 0; c < columns; c++) {
                if (infinityMode) {
                    bricks[r].push(new Brick(c * Brick.width,
                            r * Brick.height + Brick.topMargin,
                            r,
                            c,
                            (Math.random() * 100 < 30) ? ((Math.random() * 100 < 30) ? 3 : 2) : 1));
                } else {
                    if (level === 1) {
                        bricks[r].push(new Brick(c * Brick.width,
                            r * Brick.height + Brick.topMargin,
                            r,
                            c,
                            r < 2 ? (r === 0 ? 3 : 2) : 1));
                    }
                }
            }
        }
        return bricks;
    }

    static recalculateCoordinates() {
        for (let r = 1; r < game.config.brickRows; r++) {
            for (let c = 0; c < game.config.brickColumns; c++) {
                game.bricks[r][c].row++;
                game.bricks[r][c].y = game.bricks[r][c].row * (Brick.height + Brick.margin) + Brick.topMargin;
            }
        }
    }

    static adapt() {
        for (let r = 0; r < game.config.brickRows; r++) {
            for (let c = 0; c < game.config.brickColumns; c++) {
                game.bricks[r][c].x = c * Brick.width;
                game.bricks[r][c].y = game.bricks[r][c].row * Brick.height + Brick.topMargin;
            }
        }
    }
}

class Bonus extends Drawable {
    constructor(x, y, dx, dy, type) {
        super(x, y, dx, dy);
        Bonus.types = {
            ADD_LIFE: 'addLife',
            SLOW_DOWN_BALL: 'slowDownBall',
            EXPAND_PLATFORM: 'expandPlatform',
            STICK_BALL: 'stickBall',
            DOUBLE_SCORE: 'doubleScore'
        };
        Bonus.colors = {
            ADD_LIFE: '#dc143c',
            SLOW_DOWN_BALL: '#f40',
            EXPAND_PLATFORM: '#2120ff',
            STICK_BALL: '#8a2be2',
            DOUBLE_SCORE: '#00ff47'
        };
        this.type = type;
        this.color = Bonus.setBonusColor(this.type);
        this.duration = game.config.bonusDuration;
        this.requiredTimer = false;
        this.timerAssigned = false;
        this.applied = false;
    }

    static getRandomBonusType() {
        let rand = Math.round(Math.random() * 4);
        switch (rand) {
            case 0:
                return Bonus.types.ADD_LIFE;
            case 1:
                return Bonus.types.DOUBLE_SCORE;
            case 2:
                return Bonus.types.EXPAND_PLATFORM;
            case 3:
                return Bonus.types.STICK_BALL;
            case 4:
                return Bonus.types.SLOW_DOWN_BALL;
        }
    }

    static setBonusColor(type) {
        switch (type) {
            case Bonus.types.ADD_LIFE:
                return Bonus.colors.ADD_LIFE;
            case Bonus.types.DOUBLE_SCORE:
                return Bonus.colors.DOUBLE_SCORE;
            case Bonus.types.EXPAND_PLATFORM:
                return Bonus.colors.EXPAND_PLATFORM;
            case Bonus.types.STICK_BALL:
                return Bonus.colors.STICK_BALL;
            case Bonus.types.SLOW_DOWN_BALL:
                return Bonus.colors.SLOW_DOWN_BALL;
        }
    }

    static resetBonuses() {
        game.platform.expanded = false;
        game.platform.canExpend = false;
        game.ball.canSlowDown = false;
        game.ball.slowedDown = false;
        game.ball.sticks = false;
        game.ball.onPlatform = false;
    }

    cancel() {
        switch (this.type) {
            case Bonus.types.EXPAND_PLATFORM:
                game.platform.canExpend = false;
                this.applied = false;
                game.platform.width = Platform.regularWidth;
                break;
            case Bonus.types.STICK_BALL:
                game.ball.sticks = false;
                game.ball.onPlatform = false;
                this.applied = false;
                break;
            case Bonus.types.SLOW_DOWN_BALL:
                this.applied = false;
                game.ball.canSlowDown = false;
                game.ball.slowedDown = false;
                game.ball.x *= 2;
                game.ball.y *= 2;
                break;
        }
    }

    apply() {
        switch (this.type) {
            case Bonus.types.ADD_LIFE:
                game.player.life++;
                this.applied = true;
                break;
            case Bonus.types.DOUBLE_SCORE:
                game.player.score.doubleScore();
                this.applied = true;
                break;
            case Bonus.types.EXPAND_PLATFORM:
                game.platform.canExpend = true;
                this.applied = true;
                this.requiredTimer = true;
                break;
            case Bonus.types.STICK_BALL:
                game.ball.sticks = true;
                this.applied = true;
                this.requiredTimer = true;
                break;
            case Bonus.types.SLOW_DOWN_BALL:
                this.applied = true;
                game.ball.canSlowDown = true;
                this.requiredTimer = true;
                break;
        }
    }

    draw() {
        if (!this.applied) {
            ui.context.beginPath();
            ui.context.rect(this.x, this.y, Bonus.width, Bonus.height);
            ui.context.fillStyle = this.color;
            ui.context.fill();
            ui.context.closePath();
        }
    }

    update(delta) {
        if (!this.applied) {
            this.y += this.dy * delta;
        }
        if (this.x + Bonus.width > game.platform.x && this.x < game.platform.x + game.platform.width
            && this.y + Bonus.height > game.platform.y && this.y < game.platform.y + Platform.height
            && !this.applied) {
            this.apply();
        }
        return !(this.delete());
    }

    delete() {
        if (this.y > window.innerHeight + 50) {
            return true;
        }
    }

    static getBonus() {
        if (game.config.bonusesEnabled) {
            if (game.config.moreBonuses) {
                if (Math.round(Math.random() * 100) < 30) {
                    return Bonus.getRandomBonusType();
                } else return 'none';
            } else if (Math.round(Math.random() * 100) < 10) {
                return Bonus.getRandomBonusType();
            } else return 'none';
        } else return 'none';
    }
}

class Platform extends Drawable {
    constructor(x, y, color, step) {
        super(x, y, 0, 0, color);
        Platform.regularWidth = window.innerWidth * game.config.platformWidthMultiplier;
        Platform.expendedWidth = Platform.regularWidth * 1.5;
        Platform.height = Math.round(window.innerHeight * 0.03);
        this.step = step;
        this.width = Platform.regularWidth;
        this.canExpend = false;
        this.expanded = false;
    }

    draw() {
        ui.context.beginPath();
        ui.context.rect(this.x, this.y, this.width, Platform.height);
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
            if (this.x + this.width + this.step >= window.innerWidth) {
                this.x = Math.round(window.innerWidth - this.width) + 1;
            } else {
                this.x += Number(this.step);
            }
        }
        if (x > this.width / 2 && x < window.innerWidth - this.width / 2) {
            this.x = x - this.width / 2;
        }
        if (this.canExpend && !this.expanded) {
            this.x -= Math.round(this.width * 0.5 / 2);
            this.width = Platform.expendedWidth;
            this.expanded = true;
        }
        if (game.bonusTimer !== undefined && this.expanded && game.bonusTimer.stopped) {
            this.width = Platform.regularWidth;
            this.x += Math.round(this.width * 0.5 / 2);
            Bonus.resetBonuses();
        }
    }
}

class Ball extends Drawable {
    constructor(x, y, radius, delta, color) {
        super(x, y, delta, -delta, color === undefined ? Ball.getRandomColor() : color);
        Ball.radius = ((window.innerWidth + window.innerHeight) / 2) * 0.015;
        this.onPlatform = true;
        this.lost = false;
        this.sticks = false;
        this.canSlowDown = false;
        this.slowedDown = false;
    }

    draw() {
        ui.context.beginPath();
        ui.context.arc(this.x, this.y, Ball.radius, 0, Math.PI * 2);
        ui.context.fillStyle = this.color;
        ui.context.fill();
        ui.context.closePath();
    }

    start() {
        this.onPlatform = false;
    }

    update(delta) {
        if (this.canSlowDown && !this.slowedDown) {
            this.dx *= 0.5;
            this.dy *= 0.5;
            this.slowedDown = true;
        }
        if (game.bonusTimer !== undefined && game.bonusTimer.stopped && (this.slowedDown || this.sticks)) {
            if (this.sticks) {
                Bonus.resetBonuses();
            } else {
                this.dx *= 2;
                this.dy *= 2;
                Bonus.resetBonuses();
            }
        }
        if (this.onPlatform) {
            this.lost = false;
            if (this.sticks) {
                this.x = game.platform.x + Ball.deltaPlatform;
                this.y = game.platform.y - Ball.radius;
            } else {
                this.x = game.platform.x + game.platform.width / 2;
                this.y = game.platform.y - Ball.radius;
            }
        } else {
            let platformPart = game.platform.width / 7;
            if (this.y + Ball.radius > game.platform.y && this.y - Ball.radius < game.platform.y + Platform.height) {
                if (this.x < game.platform.x + game.platform.width && this.x > game.platform.x) {
                    if (this.sticks) {
                        this.onPlatform = true;
                        Ball.deltaPlatform = Math.abs(game.platform.x - this.x);
                    }
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
                } else if (this.x + Ball.radius > game.platform.x && this.x - Ball.radius < game.platform.x + game.platform.width) {
                    this.dx = -this.dx;
                }
            }
            if (this.x + this.dx * delta > window.innerWidth - Ball.radius || this.x + this.dx * delta < Ball.radius) {
                this.dx = -this.dx;
            }
            if (this.y < Ball.radius) {
                this.dy = -this.dy;
            }
            if (this.y > window.innerHeight + 50) {
                this.lost = true;
                this.onPlatform = true;
            }
            this.x += this.dx * delta;
            this.y += this.dy * delta;

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
    constructor(duration) {
        super(0, 0, 0, 0, 'red');
        this.duration = duration;
        this.dx = window.innerWidth / duration / 100;
        this.stopped = false;
    }

    draw() {
        ui.context.beginPath();
        ui.context.rect(this.x, this.y, ProgressBar.width, ProgressBar.height);
        ui.context.fillStyle = this.color;
        ui.context.fill();
        ui.context.closePath();
    }

    update(delta) {
        if (!this.stopped) {
            this.x -= this.dx * delta;
            if (this.x + ProgressBar.width <= 0) {
                this.stopped = true;
            }
        }
    }
}

class Game {
    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.timeDelta = Math.round(((innerWidth + innerHeight) / 2) * 0.003);
        this.lastFrameTime = 10;
        this.config = new Config();
        this.ball = new Ball(0, 0, 10, this.timeDelta);
        this.paused = true;
        this.bonuses = [];
        this.lose = false;
        this.win = false;
    }

    init() {
        this.config = new Config();
        this.ball = new Ball(500, 500, 10, this.timeDelta);
        this.paused = true;
        this.win = false;
        this.lose = false;
        this.progressBar = undefined;
        this.bonuses = [];
    }

    setup() {
        this.config.readPlayerConfig();
        this.config.setXMLConfig(this.ball);
        this.player.life = this.config.playerLife;
    }

    start() {
        this.paused = false;
        new Bonus();
        this.bricks = Brick.createBricks(this.config.brickRows, this.config.brickColumns, this.config.level, this.config.infinity);
        this.platform = new Platform((window.innerWidth / 2 - window.innerWidth * this.config.platformWidthMultiplier / 2),
            Config.mobile ? window.innerHeight * 0.7 : window.innerHeight - 40,
            '#006e91',
            this.config.platformStep);
        UI.adapt();
        this.requestID = requestAnimationFrame((timestamp) => this.loop(timestamp));
    }

    stop() {
        cancelAnimationFrame(this.requestID);
        this.paused = true;
        this.init();
    }

    pause() {
        this.paused = !this.paused;
    }

    resume() {
        this.paused = false;
    }

    collisionDetection() {
        for (let r = 0; r < this.config.brickRows; r++) {
            for (let c = 0; c < this.config.brickColumns; c++) {
                let currentBrick = this.bricks[r][c];
                if (currentBrick.hitsLeft > 0) {
                    if (this.ball.y + Ball.radius > currentBrick.y
                        && this.ball.y - Ball.radius < currentBrick.y + Brick.height) {
                        if (this.ball.x + Ball.radius > currentBrick.x
                            && this.ball.x - Ball.radius < currentBrick.x + Brick.width) {
                            if (this.ball.y + Ball.radius + this.ball.dy > currentBrick.y + Brick.height
                                && (this.ball.x + Ball.radius >= currentBrick.x + Brick.width
                                    || this.ball.x - Ball.radius <= currentBrick.x)) {
                                this.ball.dx = -this.ball.dx;
                            } else {
                                this.ball.dy = -this.ball.dy;
                            }
                            if (currentBrick.hitsLeft === 1) {
                                this.player.score.update(currentBrick.points, this.config);
                            }
                            if (currentBrick.haveBonus !== 'none' && currentBrick.hitsLeft === 1) {
                                this.bonuses.push(new Bonus(currentBrick.x + Brick.width / 2 - Bonus.width / 2,
                                    currentBrick.y + Brick.height,
                                    0,
                                    this.timeDelta,
                                    currentBrick.haveBonus));
                            }
                            currentBrick.hitsLeft--;
                            if (currentBrick.hitsLeft === 1) {
                                currentBrick.color = Brick.colors.ONE_HIT;
                            }
                            if (currentBrick.hitsLeft === 2) {
                                currentBrick.color = Brick.colors.TWO_HITS;
                            }
                        }
                    }
                }
            }
        }
    }

    update(delta) {
        if (!this.paused && !this.lose && !this.win) {
            this.ball.update(delta);
            this.platform.update();
            let counter = 0;
            for (let brickRow of this.bricks) {
                for (let brick of brickRow) {
                    brick.update();
                    if (brick.hitsLeft <= 0) {
                        counter++;
                    }
                }
            }
            if (counter === this.config.brickRows * this.config.brickColumns) {
                this.win = true;
                cancelAnimationFrame(this.requestID);
                ui.showBox('win');
                this.init();
            }
            for (let current in this.bonuses) {
                if (this.bonuses[current] !== undefined) {
                    if (!(this.bonuses[current].update(delta))) { //deleting lost bonuses from array
                        this.bonuses.splice(current, 1);
                    }
                    if (this.bonuses[current] !== undefined
                        && this.bonuses[current].requiredTimer === true
                        && this.bonuses[current].applied
                        && !this.bonuses[current].timerAssigned) {
                        this.bonusTimer = new Timer(this.config.bonusDuration);
                        this.progressBar = new ProgressBar(this.config.bonusDuration);
                        this.bonuses[current].timerAssigned = !this.bonuses[current].timerAssigned;
                        if (this.appliedBonus === undefined) {
                            this.appliedBonus = Object.create(this.bonuses[current]);
                        } else {
                            this.newBonus = Object.create(this.bonuses[current]);
                        }
                        if (this.newBonus !== undefined && this.newBonus.type !== this.appliedBonus.type) {
                            this.appliedBonus.cancel();
                            this.appliedBonus = this.newBonus;
                        }
                    }
                }
            }
            if (this.bonusTimer !== undefined && !this.bonusTimer.stopped) {
                this.bonusTimer.update();
            }
            if (this.progressBar !== undefined && !this.progressBar.stopped) {
                this.progressBar.update(delta);
            }
            if (this.config.infinity) {
                Brick.updateInfinity();
            }
            this.collisionDetection();
            if (this.player.life <= 0) {
                this.lose = true;
                cancelAnimationFrame(this.requestID);
                ui.showBox('lose');
                this.init();
            }
            this.player.update();
            ui.updateGameStat();
        }
    }

    render() {
        ui.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.ball.draw();
        this.platform.draw();
        if (this.progressBar !== undefined && !this.progressBar.stopped) {
            this.progressBar.draw();
        }
        for (let brickRow of this.bricks) {
            for (let brick of brickRow) {
                brick.draw();
            }
        }
        for (let bonus of this.bonuses) {
            bonus.draw();
        }
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
        this.requestID = requestAnimationFrame((timestamp) => this.loop(timestamp));
    }
}

class UI {
    constructor() {
        UI.control = {
            KEYBOARD: 'keyboard',
            MOUSE: 'mouse',
            TOUCH: 'touch'
        };
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext('2d');
        this.startGameButton = document.getElementById('startGameButton');
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
        this.pauseButton = document.getElementById('pauseButton');
        this.pauseBox = document.getElementById('pauseBox');
        this.winBox = document.getElementById('winBox');
        this.loseBox = document.getElementById('loseBox');
        this.nextLevelBox = document.getElementById('nextLevelBox');
        this.resumeButton = document.getElementById('resumeButton');
        this.backToMenuButton = document.getElementById('backToMenuButton');
        this.leaderboardTable = document.getElementById('leaderboardTable');
        this.winBackToMenuButton = document.getElementById('winBackToMenuButton');
        this.loseBackToMenuButton = document.getElementById('loseBackToMenuButton');
        this.nextLevelBackToMenuButton = document.getElementById('nextLevelBackToMenuButton');
        this.winRestartButton = document.getElementById('winRestartButton');
        this.loseRestartButton = document.getElementById('loseRestartButton');
        this.nextLevelRestartButton = document.getElementById('nextLevelRestartButton');
        this.loseScoreField = document.getElementById('loseScoreField');
        this.loseLevelField = document.getElementById('loseLevelField');
        this.winScoreField = document.getElementById('winScoreField');
        this.winLevelField = document.getElementById('winLevelField');
        this.completeLevelScoreField = document.getElementById('completeLevelScoreField');
        this.completeLevelField = document.getElementById('completeLevelField');
        this.rightPressed = false;
        this.leftPressed = false;
        this.gameNameField.innerHTML = game.name;
        this.gameVersionField.innerHTML = 'v.' + game.version;
        this.lastWindowHeight = window.innerHeight;
        this.lastWindowWidth = window.innerWidth;
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
        this.highscoreField.innerText = 'highscore: ' + Score.getHighscore(game.player);
        this.scoreField.innerText = 'score: ' + Score.getScore(game.player);
        this.lifeField.innerText = 'x ' + game.player.life;
    }

    static adapt() {
        let resolutionDeltaWidth = ui.lastWindowWidth - window.innerWidth;
        let resolutionDeltaHeight = ui.lastWindowHeight - window.innerHeight;
        ui.lastWindowWidth = window.innerWidth;
        ui.lastWindowHeight = window.innerHeight;
        Brick.width = Math.round(window.innerWidth / game.config.brickColumns);
        Brick.height = Math.round((window.innerHeight / game.config.brickRows) / 5);
        Bonus.width = Math.round(Brick.width / 2);
        Bonus.height = Math.round(Brick.height / 2);
        Platform.regularWidth = window.innerWidth * game.config.platformWidthMultiplier;
        Platform.expendedWidth = Platform.regularWidth * 1.5;
        Platform.height = Math.round(window.innerHeight * 0.03);
        ProgressBar.width = window.innerWidth;
        ProgressBar.height = Math.round(window.innerHeight * 0.0075);
        Ball.radius = ((window.innerWidth + window.innerHeight) / 2) * 0.015;
        Brick.topMargin = Math.round(window.innerHeight * 0.1);
        Brick.margin = 2;
        if (!game.paused) {
            game.platform.x -= resolutionDeltaWidth;
            game.platform.y -= resolutionDeltaHeight;
            game.platform.width = game.platform.expanded ? Platform.expendedWidth : Platform.regularWidth;
            game.ball.x -= resolutionDeltaWidth;
            game.ball.y -= resolutionDeltaHeight;
            if (game.platform.x < 0) {
                game.platform.x = 0;
            }
            if (game.platform.x + Platform.width > window.innerWidth) {
                game.platform.x = window.innerWidth - Platform.width;
            }
        }
        ui.canvas.setAttribute('width', window.innerWidth);
        ui.canvas.setAttribute('height', window.innerHeight);
        Brick.adapt();
    }

    controlHandler(event) {
        if (this.menu.style.display === 'none') {
            if (game.config.control === UI.control.TOUCH && game.paused === false && event !== undefined) {
                if (event.type === 'touchstart') {
                    game.ball.start();
                }
                if (event.type === 'touchend') {
                    game.ball.start();
                }
                if (event.type === 'touchmove') {
                    game.platform.update(Math.round(event.touches[0].clientX));
                }
            }
            if (game.config.control === UI.control.MOUSE && game.paused === false && event !== undefined) {
                if (event.type === 'click') {
                    game.ball.start();
                }
                game.platform.update(Math.round(event.clientX));
            } else if (game.config.control === UI.control.KEYBOARD && event !== undefined) {
                if (event.type === 'keydown' && (event.keyCode === 39 || event.keyCode === 68)) {
                    this.rightPressed = true;
                }
                if (event.type === 'keydown' && (event.keyCode === 37 || event.keyCode === 65)) {
                    this.leftPressed = true;
                }
                if (event.type === 'keyup' && (event.keyCode === 39 || event.keyCode === 68)) {
                    this.rightPressed = false;
                }
                if (event.type === 'keyup' && (event.keyCode === 37 || event.keyCode === 65)) {
                    this.leftPressed = false;
                }
                if (event.type === 'keyup' && event.keyCode === 32) {
                    game.ball.start();
                }
            }
            if (event.type === 'keyup' && event.keyCode === 80) {
                game.paused ? this.resume() : this.pause();
            }
        }
    }

    showBox(invoker) {
        this.boxWrapper.style.display = 'block';
        switch (invoker) {
            case this.infoButton:
                this.infoBox.style.display = 'flex';
                break;
            case this.leaderboardButton:
                this.leaderboardBox.style.display = 'flex';
                break;
            case this.removeUserButton:
                this.greeting.innerHTML = 'smb';
                this.userNameInput.value = '';
                this.nameForm.style.display = 'flex';
                UI.deleteFromLS(game.player);
                break;
            case this.changeUserButton:
                game.player.serialize();
                this.greeting.innerHTML = 'smb';
                this.userNameInput.value = '';
                this.nameForm.style.display = 'flex';
                break;
            case this.pauseButton:
                this.pauseBox.style.display = 'flex';
                break;
            case this.backToMenuButton:
                this.menu.style.display = 'flex';
                this.boxWrapper.style.display = 'none';
                break;
            case 'win':
                this.winScoreField.innerHTML = Score.getScore(game.player);
                this.winLevelField.innerHTML = game.config.level;
                this.winBox.style.display = 'flex';
                this.boxWrapper.style.display = 'block';
                break;
            case 'lose':
                this.loseScoreField.innerHTML = Score.getScore(game.player);
                this.loseLevelField.innerHTML = game.config.level;
                this.loseBox.style.display = 'flex';
                this.boxWrapper.style.display = 'block';
                break;
        }
    }

    start() {
        UI.hideBoxes(this.menu, this.winBox, this.loseBox, this.nextLevelBox, this.boxWrapper);
        this.showGameStat();
        game.setup();
        if (game.config.control === UI.control.MOUSE) {
            this.canvas.style.cursor = 'none';
        } else if (game.config.control === UI.control.KEYBOARD) {
            this.canvas.style.cursor = 'default';
        }
        game.start();
    }

    submitName() {
        let playerName;
        if (this.userNameInput.value === '') {
            playerName = 'smb';
        } else {
            playerName = this.userNameInput.value;
        }
        this.greeting.innerText = playerName;
        let storedPlayer = UI.checkLocalStorage(playerName);
        if (storedPlayer !== null) {
            storedPlayer = JSON.parse(storedPlayer);
        } else {
            storedPlayer = new Player(null, playerName, 1, 1, new Score(), 0);
        }
        game.player = new Player(storedPlayer);
        UI.hideBoxes(this.boxWrapper, this.nameForm);
    }

    static checkLocalStorage(playerName) {
        return localStorage.getItem(playerName);
    }

    static deleteFromLS(player) {
        localStorage.removeItem(player.name);
    }

    pause() {
        if (ui.menu.style.display === 'none' && ui.pauseBox.style.display !== 'none') {
            this.showBox(this.pauseButton);
            game.pause();
        }
    }

    resume() {
        UI.hideBoxes(this.boxWrapper, this.pauseBox);
        game.resume();
    }

    stop() {
        UI.hideBoxes(this.pauseBox, this.winBox, this.loseBox, this.nextLevelBox,  this.gameStat, this.boxWrapper);
        this.showBox(this.backToMenuButton);
        game.stop();
    }

    static hideBoxes() {
        for (let i in arguments) {
            arguments[i].style.display = 'none';
        }
    }

    leaderboard() {
        game.player.serialize();
        game.config.readPlayerConfig();
        let leaderboardHTML = '';
        let storedPlayers = [];
        let names = [];
        let sortedNames = [];
        let records = [];
        let sortedRecords = [];
        let timesInGame = [];
        let sortedTimesInGame = [];
        for (let item in localStorage) {
            if (typeof localStorage[item] === 'string') {
                storedPlayers.push(localStorage[item]);
            } else break;
        }
        for (let item in storedPlayers) {
            storedPlayers[item] = JSON.parse(storedPlayers[item]);
            names[item] = storedPlayers[item].name;
            timesInGame[item] = storedPlayers[item].timeInGame;
            records[item] = Score.getHighscore(storedPlayers[item]);
        }
        sortedRecords = records.slice(0);
        sortedRecords.sort((a, b) => a - b);
        sortedRecords.reverse();
        console.log(records);
        console.log(sortedRecords);
        for (let record1 in sortedRecords) {
            for (let record2 in records) {
                if (sortedRecords[record1] === records[record2]) {
                    sortedNames[record1] = names[record2];
                    sortedTimesInGame[record1] = timesInGame[record2];
                    break;
                }
            }
        }
        let counter = 1;
        for (let i in sortedNames) {
            leaderboardHTML += '<tr><td>' + counter
                            + '</td><td>' + sortedNames[i]
                            + '</td><td>' + sortedRecords[i]
                            + '</td><td>' + Timer.getMinutesAndSeconds(sortedTimesInGame[i])
                            + '</td></tr>';
            if (counter++ > 4) {
                break;
            }
        }
        ui.leaderboardTable.innerHTML = leaderboardHTML;
        this.showBox(this.leaderboardButton);
    }
}

let game = new Game('FAILOID', '0.3.3 (alpha)');
let ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    Config.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
});
window.addEventListener('beforeunload', () => {
    if (game.player !== undefined) {
        game.player.serialize();
    }
    return null;
});
window.onresize = (event) => UI.adapt(event, window.innerWidth, window.innerHeight);
window.addEventListener('blur', () => ui.pause());
ui.canvas.addEventListener('touchstart', (event) => ui.controlHandler(event));
ui.canvas.addEventListener('touchmove', (event) => ui.controlHandler(event));
ui.canvas.addEventListener('touchend', (event) => ui.controlHandler(event));
ui.submitNameButton.addEventListener('click', () => ui.submitName());
ui.winBackToMenuButton.addEventListener('click', () => ui.stop());
ui.loseBackToMenuButton.addEventListener('click', () => ui.stop());
ui.nextLevelBackToMenuButton.addEventListener('click', () => ui.stop());
ui.winRestartButton.addEventListener('click', () => ui.start());
ui.loseRestartButton.addEventListener('click', () => ui.start());
ui.nextLevelRestartButton.addEventListener('click', () => ui.start());
ui.startGameButton.addEventListener('click', () => ui.start());
ui.leaderboardButton.addEventListener('click', () => ui.leaderboard());
ui.infoButton.addEventListener('click', () => ui.showBox(ui.infoButton));
ui.fullScreenButton.addEventListener('click', UI.switchFullScreen);
ui.canvas.addEventListener('click', (event) => ui.controlHandler(event));
ui.closeLeaderboardButton.addEventListener('click', () => UI.hideBoxes(ui.boxWrapper, ui.leaderboardBox));
ui.closeInfoButton.addEventListener('click', () => UI.hideBoxes(ui.boxWrapper, ui.infoBox));
ui.removeUserButton.addEventListener('click', () => ui.showBox(ui.removeUserButton));
ui.changeUserButton.addEventListener('click', () => ui.showBox(ui.changeUserButton));
ui.pauseButton.addEventListener('click', () => ui.pause());
ui.resumeButton.addEventListener('click', () => ui.resume());
ui.backToMenuButton.addEventListener('click', () => ui.stop());
document.addEventListener('mousemove', (event) => ui.controlHandler(event));
document.addEventListener('keydown', (event) => ui.controlHandler(event));
document.addEventListener('keyup', (event) => ui.controlHandler(event));
document.addEventListener('keypress', (event) => ui.controlHandler(event));
