export const L = 9; // length of each group
export const B = 81; // length of the board

// grouping squares by sudoku blocks, default has of 27 groups
var GROUPS;

// indices of neighbors for given square
var NEIGHS;

function init() {
    var n = 3; // change this to have a different size sudoku
    GROUPS = new Array(3 * L);
    // rows
    for (let i = 0; i < L; i++) {
        GROUPS[i] = new Array(L);
        for (let j = 0; j < L; j++) {
            GROUPS[i][j] = L * i + j;
        }
    }
    // cols
    for (let i = 0; i < L; i++) {
        GROUPS[i + L] = new Array(L);
        for (let j = 0; j < L; j++) {
            GROUPS[i + L][j] = i + L * j;
        }
    }
    // blocks
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            GROUPS[n * i + j + 2 * L] = new Array(L);
            for (let k = 0; k < n; k++) {
                for (let l = 0; l < n; l++) {
                    GROUPS[n * i + j + 2 * L][n * k + l] = L * (n * i + k) + (n * j + l);
                }
            }
        }
    }

    NEIGHS = new Array(B);
    for (let i = 0; i < B; i++) {
        NEIGHS[i] = new Set();
    }

    for (let ind = 0; ind < GROUPS.length; ind++) {
        for (let i = 0; i < L; i++) {
            for (let j = 0; j < L; j++) {
                if (i != j) {
                    NEIGHS[GROUPS[ind][i]].add(GROUPS[ind][j]);
                }
            }
        }
    }
}


init();
export default class SudokuBoard {
    #board;
    #choices;
    #score;

    // string s
    constructor(s) {
        this.board = new Array(B);
        this.choices = new Array(B);
        if (typeof s === 'string') {
            s = s.replace(/\s/g, '');
            for (let i = 0; i < B; i++) {
                this.board[i] = parseInt(s.charAt(i));
            }
            for (let i = 0; i < B; i++) {
                this.update(i);
            }
            this.calcScore();
        } else {
            for (let i = 0; i < B; i++) {
                this.board[i] = 0;
                this.choices[i] = L;
                this.score = 0;
            }
        }

    }

    // creates a copy
    copy() {
        var temp = new SudokuBoard();
        temp.board = this.board.slice();
        temp.choices = this.choices.slice();
        temp.score = this.score;
        return temp;
    }

    // ind is the location to play, n is the value
    // return new board with location played
    play(ind, n) {
        var o = this.copy();
        o.board[ind] = n;
        o.update(ind);
        NEIGHS[ind].forEach(neigh => { o.update(neigh); });
        o.calcScore();
        return o;
    }


    // update the choices for the current ind
    update(ind) {
        if (this.board[ind] != 0) {
            this.choices[ind] = -1;
        } else {
            let neighbors = this.neighbors(ind);
            let count = 0;
            for (let i = 1; i < L + 1; i++) {
                count += neighbors[i] ? 0 : 1;
            }
            this.choices[ind] = count;
        }
    }


    neighbors(ind) {
        var neighbors = new Array(L + 1);
        for (let i = 0; i < L + 1; i++) {
            neighbors[i] = false;
        }
        NEIGHS[ind].forEach(i => { neighbors[this.board[i]] = true; });
        return neighbors;
    }

    // the square with minimal amount of choices
    minSquare() {
        var ind = -1;
        var min = L + 1;
        for (let i = 0; i < B; i++) {
            if (this.choices[i] != -1 && this.choices[i] < min) {
                min = this.choices[i];
                ind = i;
            }
        }
        return ind;
    }

    // welp
    isFilled() {
        return this.minSquare() == -1;
    }

    // should not be called often as it's inefficient,
    // should use isNeighbors to check for valid plays to make sure board is valid.
    isValid() {
        for (let i = 0; i < B; i++) {
            if (this.board[i] == 0) {
                continue;
            }
            if (this.neighbors(i)[this.board[i]]) {
                return false;
            }
        }
        return true;
    }

    // ugh
    isSolved() {
        return this.isFilled() && this.isValid();
    }

    static compare(o1, o2) {
        return o1.score - o2.score;
    }


    toString() {
        var s = '';
        for (let i = 0; i < B; i++) {
            s += this.board[i] + ' ';
            if ((i + 1) % L == 0) {
                s += '\n';
            }
        }
        return s;
    }

    // calculate the score for the board
    calcScore() {
        this.score = 0;
        this.choices.forEach(c => { this.score -= c; });
    }
}
