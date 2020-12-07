import Tile from "./Tile.js";

export default class SudokuSolver {
  board;
  isValid;

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



  createArray(length) {
    let x = new Array(length);
    for (let i = 0; i < x.length; i++) {
      x[i] = new Array(length);
    }
    return x;
  }


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

  horizontal(row) {
    let occupied = new Set();
    for (let t of row) {
      occupied.add(t);
    }
    return occupied;
  }

  vertical(board, col) {
    let tiles = new Set();
    for(let i = 0; i < 9; i++){
      tiles.add(board[i][col]);
    }
    return tiles;
  }

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

  solve() {
    this.board = this.solveHelper(this.board, -1, -1, 0);
  }

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