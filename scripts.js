
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

    let gameOn = false;
    let roundOn = false;

    const isGameOn = () => gameOn;
    const isRoundOn = () => roundOn;
    const endRound = () => roundOn = false;

    const checkTie = () => {
        const board = GameBoard.getBoard();
        if (board.includes(null)) return false;
        return true;
    };

    const checkWinCondition = () => {
        const currentPlayer = getCurrentPlayer();
        const playerMark = currentPlayer.mark;
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

    let currentPlayerIndex = 0;
    const getCurrentPlayer = () => players[currentPlayerIndex];
    const switchTurn = () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    const playTurn = (index) => {
        if (gameOn && roundOn) {
            const currentPlayer = getCurrentPlayer();
            const playerMark = currentPlayer.mark;
            const success = GameBoard.placeMark(index, playerMark)
            if (!success) return { overState: false };
            DOMMaster.renderBoard();
            DOMMaster.renderScores();
            if (checkWinCondition()) {
                currentPlayer.addPoint();
                return { overState: true, winner: currentPlayer };
            }
            if (checkTie()) {
                return { overState: true, winner: null };
            }
            switchTurn();
            DOMMaster.announce(`${getCurrentPlayer().name}'s turn`);
            return { overState: false };
        } else if (!gameOn) {
            DOMMaster.announce("Start the game first!");
        } else if (gameOn && !roundOn) {
            DOMMaster.announce("Go next round!");
        }
    };
    const playRound = () => {
        roundOn = true;
        GameBoard.resetBoard();
        DOMMaster.renderBoard();
        DOMMaster.renderScores();
        DOMMaster.announce(`${getCurrentPlayer().name}'s turn`);
    };

    const playGame = () => {
        gameOn = true;
        player1.resetScore();
        player2.resetScore();
        playRound();
    }

    const getP1Name = () => player1.name;
    const getP2Name = () => player2.name;
    const setP1Name = (name) => player1.name = name;
    const setP2Name = (name) => player2.name = name;
    const getP1Score = () => player1.getScore();
    const getP2Score = () => player2.getScore();

    return { playGame, getP1Name, getP2Name, setP1Name, setP2Name, getP1Score, getP2Score, playRound, playTurn, isRoundOn, endRound };
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
    const btnCntnr = document.querySelector('.btnCntnr');

    gameCells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            const targetCell = event.target;
            const cellIndex = targetCell.getAttribute('data-id');
            const result = GameMaster.playTurn(parseInt(cellIndex));
            if (result.overState) {
                renderScores();
                createRoundBtn();
                if (result.winner === null) {
                    GameMaster.endRound();
                    announce(`It's a tie!`);
                } else {
                    GameMaster.endRound();
                    announce(`${result.winner.name} wins!`)
                }
            }
        })
    })

    const createRoundBtn = () => {
        const roundBtn = document.createElement('button');
        roundBtn.classList.add('roundBtn');
        roundBtn.textContent = 'Next Round';
        btnCntnr.appendChild(roundBtn);
        roundBtn.addEventListener('click', () => {
            GameMaster.playRound();
            roundBtn.remove();  
        });
    }

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
        const p1Score = GameMaster.getP1Score();
        const p2Score = GameMaster.getP2Score();
        const previousScores = scoreBoard.querySelectorAll('p');
        previousScores.forEach((p) => {
            scoreBoard.removeChild(p);
        })
        const p1Name = document.createElement('p');
        p1Name.classList.add('name');
        const p2Name = document.createElement('p');
        p2Name.classList.add('name');
        const p1Node = document.createElement('p');
        p1Node.classList.add('playerScore');
        const p2Node = document.createElement('p');
        p2Node.classList.add('playerScore');
        p1Name.textContent = GameMaster.getP1Name();
        p2Name.textContent = GameMaster.getP2Name();
        p1Node.textContent = p1Score;
        p2Node.textContent = p2Score;
        scoreBoard.appendChild(p1Name);
        scoreBoard.appendChild(p1Node);
        scoreBoard.appendChild(p2Name);
        scoreBoard.appendChild(p2Node);
    }

    playBtn.addEventListener('click', () => {
        nameModal.showModal();
        playBtn.remove();
    })

    nameForm.addEventListener('submit', () => {
        const nameData = new FormData(nameForm);
        const p1Name = nameData.get('player1-name');
        const p2Name = nameData.get('player2-name');
        GameMaster.setP1Name(p1Name);
        GameMaster.setP2Name(p2Name);
        GameMaster.playGame();
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
//