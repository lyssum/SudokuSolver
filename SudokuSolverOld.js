import Tile from "./Tile.js";

export default class SudokuSolver {

  // {Tile[][]} This sudoku solver's board
  board;
  // {boolean} Whether this board is valid
  isValid;

  /**
   * Constructs a SudokuSolver from a given board or from
   * another instance of a SudokuSolver
   * @param {Object} board a board to construct a solver for
   */
  constructor(board) {
    if (typeof board == "string") {
      board = board.replace(/\s/g,'');
      this.board = this.createArray(9);
      let boardIndex = 0;
      for (let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
            this.board[row][col] = new Tile(board.charAt(boardIndex));
            boardIndex++;
        }
      }
      this.isValid = this.updatePossible();
    } else {
      this.board = this.createArray(9);
      for (let i = 0 ; i < 9; i++){
          for(let j = 0 ; j < 9; j++){
            let input = board[i][j].getValue();
            this.board[i][j] = new Tile(input);
          }
      }
      this.isValid = this.updatePossible();
    }
  }


  /**
   * Creates a 2D array of a given length
   * @param {int} length length of which to create an array
   * @returns x a newly created 2D array
   */
  createArray(length) {
    let x = new Array(length);
    for (let i = 0; i < x.length; i++) {
      x[i] = new Array(length);
    }
    return x;
  }

  // Updates the possible values for every tile in the Sudoku Solver
  updatePossible() {
    let b = true;
    for (let rows = 0; rows < 9; rows++){
        let row = this.horizontal(this.board[rows]);
        if(!this.handleList(row)){
            b = false;
        }
    }
    for (let col = 0; col < 9; col++){
        let column = this.vertical(this.board, col);
        if(!this.handleList(column)){
            b = false;
        }
    }
    for (let region = 0; region < 9; region++){
        let newRegion = this.buildRegion(region, this.board);
        if(!this.handleList(newRegion)){
            b = false;
        }
    }
    return b;
  }

  /**
   * Creates a row set from a given row of tiles
   * @param {Tile[]} row An array of tiles representing a single row
   * @returns {Set<Tile>} a set with references to each tile in a given row
   */
  horizontal(row) {
    let occupied = new Set();
    for (let t of row) {
      occupied.add(t);
    }
    return occupied;
  }


  /**
   * Creates a column set from a given column of tiles
   * @param {Tile[][]} board An 2D array of tiles for this solver's board
   * @param {int} col the current column number
   * @returns {Set<Tile>} a set with references to each tile in a given column
   */
  vertical(board, col) {
    let tiles = new Set();
    for(let i = 0; i < 9; i++){
      tiles.add(board[i][col]);
    }
    return tiles;
  }

  /**
   * Creates a region set corresponding to the region number
   * @param {int} region the current region number
   * @param {Tile[][]} board An 2D array of tiles for this solver's board
   */
  buildRegion(region, board) {
    let list = new Set();
    let xSpan = Math.floor(region / 3) * 3;
    let ySpan = (region % 3) * 3;
    for(let x = xSpan; x < xSpan + 3; x++){
        for(let y = ySpan; y < ySpan + 3; y++){
            list.add(board[x][y]);
        }
    }
    return list;
  }

  /**
   * Changes the possible values of each tile
   * @param {Set<Tile>} list A set of tiles to change the values of
   * @returns {Boolean} a boolean representing if the board is a solution
   */
  handleList(list) {
    let values = new Set();
    let yo = new Set();
    let b = true;
    for(let t of list){
        if(t.getValue() != 0 && yo.has(t.getValue())){
            b = false;
        } else {
            yo.add(t.getValue());
        }
        values.add(t.getValue());
    }
    for(let t of list){
        if (t.getValue() == 0){
            for(let i of values){
                if(t.getCandidates().has(i)){
                    t.getCandidates().delete(i);
                }
            }
        }
    }
    return b;
  }


  /**
   * Creates a string representation of the solved board
   * @returns {String} a string representation of the board
   */
  toString() {
    if (this.board !== null) {
      let boardString = "";
      for (let row = 0; row < 9; row++) {
          for(let col = 0; col < 9; col++) {
              boardString += this.board[row][col].getValue() + " ";
          }
          boardString += "\n";
      }
      boardString += "\n";
      return boardString;
    } else {
      let boardString = "The given puzzle was not a valid Sudoku Puzzle";
      return boardString;
    }
  }

  // Creates a solution for this board
  solve() {
    this.board = this.solveHelper(this.board, -1, -1, 0);
  }

  // Find the next empty coordinate to solve
  findNextCoord() {
    for(let row = 0; row < 9; row++){
      for(let col = 0; col < 9; col++){
          if(this.board[row][col].getValue() == 0){
              return row * 9 + col;
          }
      }
    }
    return -1;
  }

  /**
   * Creates a solution for this board
   * @param {SudokuSolver} solver the current Solver
   * @param {int} y An integer representing the current y coordinate
   * @param {int} x An integer representing the current x coordinate
   * @param {int} newVal A new possible value
   * @returns {Tile[][]} a solved board
   */
  solveHelper(solver, y, x, newVal) {
    let newS = new SudokuSolver(solver);
    if(y != -1){
        newS.board[y][x].setValue(newVal);
        newS.isValid = newS.updatePossible();
    }
    if (!newS.isValid){
        return null;
    } else {
        let n = newS.findNextCoord();
        if(n == -1 ){
            return newS.board;
        } else {
            let t = newS.board[Math.floor(n / 9)][n % 9];
            for(let h of t.getCandidates()){
                let temp = this.solveHelper(newS.board, Math.floor(n / 9), n % 9, h);
                if (temp !== null){
                    return temp;
                }
            }
        }
    }
    return null;
  }
}
