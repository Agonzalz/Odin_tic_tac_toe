const Gameboard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, placeMarker, resetBoard };
})();


const createPlayer = (name, marker) => {
    return { name, marker };
};

const GameController = (function () {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (player1Name, player2Name) => {
        players = [createPlayer(player1Name, "X"), createPlayer(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.updateBoard();
        DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn`);
    };

    const playTurn = (index) => {
        if (gameOver || !Gameboard.placeMarker(index, players[currentPlayerIndex].marker)) return;

        DisplayController.updateBoard();

        if (checkWinner()) {
            gameOver = true;
            DisplayController.setMessage(`${players[currentPlayerIndex].name} wins!`);
            return;
        }

        if (Gameboard.getBoard().every(cell => cell !== "")) {
            gameOver = true;
            DisplayController.setMessage("It's a tie!");
            return;
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        DisplayController.setMessage(`${players[currentPlayerIndex].name}'s turn`);
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]  // Diagonals
        ];

        return winningCombos.some(combo => {
            const [a, b, c] = combo;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    return { startGame, playTurn };
})();


const DisplayController = (function () {
    const boardCells = document.querySelectorAll(".cell");
    const message = document.getElementById("message");
    const startBtn = document.getElementById("start-btn");

    boardCells.forEach((cell, index) => {
        cell.addEventListener("click", () => GameController.playTurn(index));
    });

    startBtn.addEventListener("click", () => {
        const player1Name = document.getElementById("player1").value || "Player 1";
        const player2Name = document.getElementById("player2").value || "Player 2";
        GameController.startGame(player1Name, player2Name);
    });

    const updateBoard = () => {
        const board = Gameboard.getBoard();
        boardCells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const setMessage = (msg) => {
        message.textContent = msg;
    };

    return { updateBoard, setMessage };
})();
