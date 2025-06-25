
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
    return {getBoard, placeMark, resetBoard, printBoard};
})();


const GameMaster = (function(){
    const winCondition = () => {
        let currentBoard = GameBoard.getBoard();
        // Do i need to map all the possible winning scenarios? 
        // Maybe i just need a rule, like giving each board index a value, like 0 has a start, start value and 8 has an end end value, 4 has a mid, mid value? so maybe just check if the same mark is in.... nvm.
        // 
    }
})();