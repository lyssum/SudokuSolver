import SudokuBoard from "./SudokuBoard.js";
import { L } from "./SudokuBoard.js";

// limit is the minimal amount of solution returned (if there's that many)
// return the set of all solved board
export function solveAll(board, limit) {
  if (!(board instanceof SudokuBoard)) {
    board = new SudokuBoard(board);
  }
  return uncheckedSolve(board, limit);
}

// looking for one solution
export default function solve(board) {
  var s = solveAll(board, 1);
  if (s.size == 0) {
    return null;
  }
  return s.values().next();
}

// private helper to solve
// requires the input board to be valid, not checking is the input board valid
function uncheckedSolve(board, limit) {
  if (board instanceof SudokuBoard) {
    var set = new Set();
    var ind = board.minSquare();
    if (ind == -1) {
      set.add(board);
      return set;
    }
    var neighbors = board.neighbors(ind);
    var states = new Array();
    for (let i = 1; i < L + 1; i++) {
      if (!neighbors[i]) {
        states.push(board.play(ind, i));
      }
    }
    states.sort(SudokuBoard.compare);
    for (let state in states) {
      let solved = uncheckedSolve(state, limit);
      for (let b in solved) {
        set.add(b);
      }
      if (set.size >= limit)
        return set;
    }
    return set;
  }
}





