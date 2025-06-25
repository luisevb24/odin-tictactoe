
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

function createPlayer(name, mark) {
    let score = 0;
    const getScore = () => score;
    const addPoint = () => ++score;
    const resetScore = () => score = 0;
    return { name, mark, getScore, addPoint, resetScore };
}

const GameMaster = (function () {
    const player1 = createPlayer('1', 'X');
    const player2 = createPlayer('2', 'O');


    const declareWin = (player) => {
        console.log(`${player.name} wins!`);
        player.addPoint();
    }

    const playTurn = (player) => {
        if (checkWinCondition()){
            declareWin(player);
            changePlayer();
        };
    }


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
                if (board[firstIndex] === board[secondIndex] && board[secondIndex] === board[thirdIndex]){
                    return true;
                }
            }
        });
    }
})();