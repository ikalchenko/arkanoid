function parseJSON() {
    
} parseJSON(json) {
    let name;
    let availableLevel;
    let timeInGame;
    let highscore;
    let infEasy;
    let infNormal;
    let infHard;
    let infImpossible;
    let regEasy;
    let regNormal;
    let regHard;
    let regImpossible;
    JSON.parse(json, (key, value) => {
        if (key === 'name') {
            name = value;
        }
        if (key === 'availableLevel') {
            availableLevel = value;
        }
        if (key === 'timeInGame') {
            timeInGame = value;
        }
        if (key === 'score') {
            console.log(value);
            JSON.parse(value, (key2, value2) => {
                if (key2 === 'highscore') {
                    JSON.parse(value2, (key3, value3) => {
                        if (key3 === 'infinity') {
                            JSON.parse(value3, (key4, value4) => {
                                if (key4 === 'easy') {
                                    infEasy = value4
                                }
                                if (key4 === 'normal') {
                                    infNormal = value4
                                }
                                if (key4 === 'hard') {
                                    infHard = value4
                                }
                                if (key4 === 'impossible') {
                                    infImpossible = value4
                                }
                            });
                        }
                        if (key3 === 'regular') {
                            JSON.parse(value3, (key5, value5) => {
                                if (key5 === 'easy') {
                                    regEasy = value5
                                }
                                if (key5 === 'normal') {
                                    regNormal = value5
                                }
                                if (key5 === 'hard') {
                                    regHard = value5
                                }
                                if (key5 === 'impossible') {
                                    regImpossible = value5
                                }
                            });
                        }
                    });
                }
            });
        }

    });
    highscore = {
        infinity: {
            easy: infEasy,
            normal: infNormal,
            hard: infHard,
            impossible: infImpossible
        },
        regular: {
            easy: regEasy,
            normal: regNormal,
            hard: regHard,
            impossible: regImpossible
        }
    };
    return new Player(name, 1, availableLevel, new Score(highscore), timeInGame);
}