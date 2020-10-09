/** 
 * Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie).
 */

const WIDTH = 7;
const HEIGHT = 6;

// active player: 1 or 2
let currPlayer = 1;
// array of rows, each row is array of cells  (board[y][x])
const board = []; 
// use to tell if players can add pieces on board
let gameOver = false;

/** 
 * makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells (board[y][x])
 */
function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push([])
    for (let x = 0; x < WIDTH; x++) {
      board[y].push(null);
    }
  }
}

/** 
 * makeHtmlBoard: make HTML table and row of column tops. 
 */
function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // create top row for board
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  // when user clicks on top row, a piece is added by handleClick(evt)
  top.addEventListener("click", handleClick);

  // add cells for top row of board
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // add the main rows for the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    // add cells to each row in the board
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/**
 * findSpotForCol: given column x, return top empty y (null if filled)
 * @param {number} x
 * @return lowest row with empty cell in column x of board
 */
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/**
 * placeInTable: update DOM to place piece into HTML table of board
 * @param {number} y
 * @param {number} x
 */
function placeInTable(y, x) {
  // make a div and insert into correct table cell
  const newPiece = document.createElement("div");
  newPiece.classList.add("piece");
  newPiece.classList.add(`player${currPlayer}`);
  const td = document.getElementById(`${y}-${x}`);
  td.append(newPiece);
}

/**
 * endGame: announce game end
 * @param {string} msg
 */
function endGame(msg) {
  // pop up alert message
  gameOver = true;
  setTimeout(() => alert(msg), 1000);
}

/**
 * handleClick: handle click of column top to play piece
 * @param {Object} evt
 */
function handleClick(evt) {
  // check first if game is in play
  if (gameOver) {
    return;
  }

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  // add line to update in-memory board
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check if all cells in board are filled; if so, announce tie with endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame("Tie!");
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/**
 * checkForWin: check board cell-by-cell for "does a win start here?"
 * @return true if there is four in a row for currPlayer, false otherwise
 */

function checkForWin() {
  // Check four cells to see if they're all color of current player
  // - cells: list of four (y, x) cells
  // - returns true if all are legal coordinates & all match currPlayer
  function _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // starting at each cell
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // check for four in a row right, down, diag right down, diag left down
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
