
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

        return { getScore, resetScore, mark, name, addPoint };
    }
    const player1 = createPlayer('player1', 'X');
    const player2 = createPlayer('player2', 'O');
    const players = [player1, player2];
    let currentPlayerIndex = 0;
    const getCurrentPlayer = () => players[currentPlayerIndex];
    const switchTurn = () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    const playTurn = (index) => {
        const currentPlayer = getCurrentPlayer();
        const playerMark = currentPlayer.mark;
        const success = GameBoard.placeMark(index, playerMark)
        if (!success) return { overState: false };

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
                    if (board[firstIndex] === playerMark && board[secondIndex] === playerMark && board[thirdIndex] === playerMark) {
                        return true;
                    }
                }
            });
        };
        const checkTie = () => {
            const board = GameBoard.getBoard();
            if (board.includes(null)) return false;
            return true;
        };
        DOMMaster.renderBoard();

        if (checkWinCondition()) {
            currentPlayer.addPoint();
            DOMMaster.renderBoard();
            return { overState: true, winner: currentPlayer };
        }
        if (checkTie()) {
            DOMMaster.renderBoard();
            return { overState: true, winner: null };
        }
        switchTurn();
        DOMMaster.renderScores();
        DOMMaster.announce(`${getCurrentPlayer().name}'s turn`);
        return { overState: false };
    }
    const playRound = () => {
        GameBoard.resetBoard();
        DOMMaster.renderBoard();
        DOMMaster.renderScores();
        DOMMaster.announce(`${getCurrentPlayer().name}'s turn`);
    };

    const playGame = () => {
        player1.resetScore();
        player2.resetScore();
        playRound();
    }
    return { playGame, player1, player2, playRound, playTurn };
})();

const DOMMaster = (function () {
    const body = document.body;
    const gameBoard = document.querySelector('.gameBoardContainer');
    const playBtn = body.querySelector('.playBtn');
    const nameModal = body.querySelector('#nameModal');
    const gameAnnouncer = body.querySelector('#gameAnnouncer');
    const gameCells = document.querySelectorAll('.cell');
    const scoreBoard = document.querySelector('.score');
    const nameForm = document.querySelector('#nameForm');

    gameCells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            const targetCell = event.target;
            const cellIndex = targetCell.getAttribute('data-id');
            const result = GameMaster.playTurn(parseInt(cellIndex));
            if (result.overState) {
                if (result.winner === null) {
                    announce(`It's a tie!`);
                } else {
                    announce(`${result.winner.name} wins!`)
                }
            }
        })
    })


    const announce = (announcement) => {
        let pMessage = gameAnnouncer.querySelector('p');
        if (pMessage) {
            gameAnnouncer.removeChild(pMessage);
        }
        let message = document.createElement('p');
        message.classList.add('announce');
        message.textContent = announcement;
        gameAnnouncer.appendChild(message);
    }

    const renderScores = () => {
        const p1Score = GameMaster.player1.getScore();
        const p2Score = GameMaster.player2.getScore();
        const previousScores = scoreBoard.querySelectorAll('p');
        previousScores.forEach((p) => {
            scoreBoard.removeChild(p);
        })
        const p1Name = document.createElement('p');
        const p2Name = document.createElement('p');
        const p1Node = document.createElement('p');
        const p2Node = document.createElement('p');
        p1Name.textContent = GameMaster.player1.name;
        p2Name.textContent = GameMaster.player2.name;
        p1Node.textContent = p1Score;
        p2Node.textContent = p2Score;
        scoreBoard.appendChild(p1Name);
        scoreBoard.appendChild(p1Node);
        scoreBoard.appendChild(p2Name);
        scoreBoard.appendChild(p2Node);
    }

    playBtn.addEventListener('click', () => {
        nameModal.showModal();
        announce('Welcome!');
        GameMaster.playGame();
    })

    nameForm.addEventListener('submit', () => {
        const nameData = new FormData(nameForm);
        const p1Name = nameData.get('player1-name');
        const p2Name = nameData.get('player2-name');
        GameMaster.player1.name = p1Name;
        GameMaster.player2.name = p2Name;
    })



    const renderBoard = () => {
        let board = GameBoard.getBoard();
        board.forEach((cell, index) => {
            let domCell = document.getElementById(`${index}`);
            let existingP = domCell.querySelector('p');
            if (existingP) {
                domCell.removeChild(existingP);
            }
            let cellMark = document.createElement('p');
            cellMark.textContent = cell;
            domCell.appendChild(cellMark);
        })
    }
    return { renderBoard, announce, renderScores }

})()

//Check for when the game is over;
//Change the play button for a next round button, or maybe start it automatically.
//Add 3 wins logic
//Style names modal
//