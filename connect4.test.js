describe("makeBoard() tests (with setup)", () => {
  beforeAll(() => {
    while (board.length > 0) {
      board.pop();
    }
  });

  it("creates board correctly", () => {
    makeBoard();
    expect(board).toEqual([
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ]);
  });
});

describe("makeHtmlBoard() tests (with setup)", () => {
  beforeAll(() => {
    const htmlBoard = document.getElementById("board");
    while (htmlBoard.children.length > 0) {
      htmlBoard.firstChild.remove();
    }
    makeHtmlBoard();
  });

  it("Adds tr#column-top to table#board", () => {
    const columnTop = document.getElementById("column-top");
    expect(columnTop).not.toBeNull();
  });
  
  it("Adds 7 total tr elements to table#board", () => {
    const rows = document.getElementsByTagName("tr");
    expect(rows.length).toEqual(7);
  });

  it("id of each td element in tr#column-top is its column index", () => {
    const columnTop = document.getElementById("column-top");
    for (let i = 0; i < columnTop.children.length; i++) {
      expect(columnTop.children[i].id).toEqual(i.toString());
    }
  });

  it("id of td elements in other tr elements based on row and column", () => {
    const htmlBoard = document.getElementById("board");
    for (let rowIndex = 1; rowIndex < htmlBoard.children.length; rowIndex++) {
      const row = htmlBoard.children[rowIndex];
      for (let cellIndex = 0; cellIndex < row.children.length; cellIndex++) {
        expect(row.children[cellIndex].id)
          .toEqual(`${rowIndex - 1}-${cellIndex}`);     
      }
    }
  });
});

describe("findSpotForCol(x) (with cleanup)", () => {
  it("returns 5 if board is empty", () => {
    expect(findSpotForCol(2)).toEqual(5);
  });

  it("returns 5 if all columns but column x have pieces", () => {
    board[3][0] = 2;
    board[4][0] = 1;
    board[5][0] = 1;
    board[4][1] = 1;
    board[5][1] = 2;
    board[5][2] = 2;
    board[5][4] = 2;
    board[5][5] = 1;
    board[2][6] = 2;
    board[3][6] = 1;
    board[4][6] = 2;
    board[5][6] = 1;
    expect(findSpotForCol(3)).toEqual(5);
  });

  it("returns null if column x is null", () => {
    board[0][1] = 1;
    board[1][1] = 2;
    board[2][1] = 2;
    board[3][1] = 1;
    board[4][1] = 1;
    board[5][1] = 1;
    expect(findSpotForCol(1)).toBeNull();
  });

  it("returns 3 if column x has 2 pieces", () => {
    board[5][5] = 1;
    board[4][5] = 2;
    expect(findSpotForCol(5)).toEqual(3);
  });

  afterEach(() => {
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        board[y][x] = null;
      }
    }
  });
});

describe("placeInTable(y, x) tests (with cleanup)", () => {
  it("places piece correctly", () => {
    placeInTable(3, 4);
    const pieceCell = document.getElementById("3-4");
    expect(pieceCell.firstChild.classList.contains("piece")).toBeTruthy();
  });

  it("places piece correctly in the top-left corner", () => {
    placeInTable(0, 0);
    const pieceCell = document.getElementById("0-0");
    expect(pieceCell.firstChild.classList.contains("piece")).toBeTruthy();
  });

  it("places piece correctly in the bottom-right corner", () => {
    placeInTable(5, 6);
    const pieceCell = document.getElementById("5-6");
    expect(pieceCell.firstChild.classList.contains("piece")).toBeTruthy();
  });

  afterEach(() => {
    const cells = document.getElementsByTagName("td");
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].children.length > 0) {
        cells[i].children[0].remove();
      }
    }
  });
});

describe("handleClick(evt) tests (with cleanup)", () => {
  it("places red piece correctly on html and js board", () => {
    board[5][3] = 1;
    const evt = {
      target: {
        id: "3"
      }
    }
    handleClick(evt);
    const pieceCell = document.getElementById("4-3");
    expect(pieceCell.firstChild.classList.contains("piece")).toBeTruthy();
    expect(pieceCell.firstChild.classList.contains("player1")).toBeTruthy();
    expect(board[4][3]).toEqual(1);
  });

  it("places blue piece correctly on html and js board", () => {
    board[5][3] = 1;
    currPlayer = 2;
    const evt = {
      target: {
        id: "3"
      }
    }
    handleClick(evt);
    const pieceCell = document.getElementById("4-3");
    expect(pieceCell.firstChild.classList.contains("piece")).toBeTruthy();
    expect(pieceCell.firstChild.classList.contains("player2")).toBeTruthy();
    expect(board[4][3]).toEqual(2);
  });

  it("changes currPlayer from 1 to 2", () => {
    const evt = {
      target: {
        id: "3"
      }
    }
    handleClick(evt);
    expect(currPlayer).toEqual(2);
  });

  it("changes currPlayer from 2 to 1", () => {
    currPlayer = 2
    const evt = {
      target: {
        id: "3"
      }
    }
    handleClick(evt);
    expect(currPlayer).toEqual(1);
  });

  it("does nothing if gameOver is true", () => {
    gameOver = true;
    const evt = {
      target: {
        id: "3"
      }
    }
    handleClick(evt);
    const pieceCell = document.getElementById("4-3");
    expect(pieceCell.children.length).toEqual(0);
    expect(board[4][3]).toBeNull();
    expect(currPlayer).toEqual(1);
  });

  afterEach(() => {
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        board[y][x] = null;
      }
    }

    const cells = document.getElementsByTagName("td");
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].children.length > 0) {
        cells[i].children[0].remove();
      }
    }

    currPlayer = 1;
    gameOver = false;
  });
});