
const GameBoard = (function () {
    let board = Array(9).fill(null);
    const getBoard = () => [...board];
    const resetBoard = () => board = Array(9).fill(null);
    const placeMark = (index, mark) => {
        if (index < 0 || index > 8) return false;
        if (board[index] !== null) return false;
        board[index] = mark;
        return true;
    }
    const printBoard = () => console.log(formatBoard(board));
    const formatBoard = (b) => {
        return `
     ${b[0] || " "} | ${b[1] || " "} | ${b[2] || " "}
    ---+---+---
     ${b[3] || " "} | ${b[4] || " "} | ${b[5] || " "}
    ---+---+---
     ${b[6] || " "} | ${b[7] || " "} | ${b[8] || " "}
    `;
    };
    return { getBoard, placeMark, resetBoard, printBoard };
})();


const GameMaster = (function () {
    function createPlayer(name, mark) {
        let score = 0;
        const getScore = () => score;
        const addPoint = () => ++score;
        const resetScore = () => score = 0;
        const checkWinCondition = () => {
            const winScenarios = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]]
            const board = GameBoard.getBoard();
            return winScenarios.some((scenario) => {
                const firstIndex = scenario[0];
                const secondIndex = scenario[1];
                const thirdIndex = scenario[2];
                if (board[firstIndex] !== null) {
                    if (board[firstIndex] === mark && board[secondIndex] === mark && board[thirdIndex] === mark) {
                        return true;
                    }
                }
            });
        };
        const checkTie = () => {
            const board = GameBoard.getBoard();
            if (board.includes(null)) return false;
            return true;
        }
        const declareTie = () => console.log("It's a tie");
        const declareWin = () => {
            console.log(`${name} wins!`);
            addPoint();
        }
        const playTurn = () => {
            let boardIndex = parseInt(prompt(`${name} Play your turn!`), 10);
            let placedMark = GameBoard.placeMark(boardIndex, mark);
            while (!placedMark) {
                boardIndex = parseInt(prompt(`Invalid cell`), 10);
                placedMark = GameBoard.placeMark(boardIndex, mark);
            };

            if (checkWinCondition()) {
                GameBoard.printBoard();
                declareWin();
                return true;
            }
            if (checkTie()) {
                GameBoard.printBoard();
                declareTie();
                return true;
            }
            GameBoard.printBoard();
            return false;
        }
        return { getScore, resetScore, playTurn, name };
    }
    const player1 = createPlayer('Player 1', 'X');
    const player2 = createPlayer('Player 2', 'O');

    const playRound = () => {
        GameBoard.resetBoard();
        GameBoard.printBoard();
        while (!player1.playTurn() && !player2.playTurn());
        console.log(`${player1.name}: ${player1.getScore()}  ${player2.name}: ${player2.getScore()}`);
    }

    const playGame = () => {
        while(player1.getScore() < 3 && player2.getScore() < 3){
            playRound();
        }
        if (player1.getScore() === 3){
            console.log(`${player1.name} is the winner!`);
        } else if (player2.getScore() ===3){
            console.log(`${player2.name} is the winner!`)
        }
    }
    return { playGame, player1, player2, playRound };
})();
