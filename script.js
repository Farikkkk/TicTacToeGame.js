const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status-text");
const restartBtn = document.querySelector(".restart-btn");
const counter = document.querySelector(".counter");

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let playerWins = 0;
let aiWins = 0;

initializeGame();

function initializeGame() {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  statusText.innerHTML = `${currentPlayer}'s turn`;
  running = true;
}

function cellClicked() {
  const cellIndex = this.getAttribute("cellIndex");
  if (options[cellIndex] != "" || !running) return;

  updateCell(this, cellIndex);
  checkWinner();

  if (running && currentPlayer === "O") {
    computerMove();
  }
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.innerHTML = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.innerHTML = `${currentPlayer}'s turn`;
  statusText.innerHTML = "";
}

function checkWinner() {
  let roundWon = false;
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }

    if (cellA == cellB && cellB == cellC) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    if (currentPlayer === "X") {
      playerWins++;
    } else {
      aiWins++;
    }
    updateCounter();

    statusText.innerHTML = `${currentPlayer} wins!`;
    running = false;
  } else if (!options.includes("")) {
    statusText.innerHTML = `Draw!`;
    running = false;
  } else {
    changePlayer();
  }
}

function updateCounter() {
  counter.innerHTML = `You: ${playerWins} vs AI: ${aiWins}`;
}

function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.innerHTML = `${currentPlayer}'s turn `;
  cells.forEach((cell) => (cell.innerHTML = ""));
  running = true;
}

function computerMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < options.length; i++) {
    if (options[i] === "") {
      options[i] = "O";
      let score = minimax(options, 0, false);
      options[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  updateCell(cells[bestMove], bestMove);
  checkWinner();
}

function minimax(board, depth, isMaximizing) {
  let scores = {
    X: -1,
    O: 1,
    tie: 0,
  };

  let result = checkWinnerForMinimax();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinnerForMinimax() {
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }
    if (cellA == cellB && cellB == cellC) {
      return cellA;
    }
  }

  if (!options.includes("")) {
    return "tie";
  }
  return null;
}
