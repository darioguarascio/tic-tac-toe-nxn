"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.MatchBox = void 0;
var MatchBox = /** @class */ (function () {
    // Generates a NxN item
    function MatchBox(state, strikeSize) {
        this.X_SYMBOL = 'X';
        this.O_SYMBOL = '0';
        this.__SYMBOL = '_';
        this.INITIAL_MOVE_WEIGHT = 3;
        this.gridSize = Math.sqrt(state.length);
        this.strikeSize = strikeSize;
        this.state = state;
    }
    ;
    MatchBox.prototype.makeMove = function (player, cell) {
        // console.log([cell, this.state])
        if (typeof (cell) == 'undefined' || this.state.length < cell || cell < 0) {
            throw new Error('Invalid cell:' + cell);
        }
        if (this.state[cell] !== 2) {
            throw new Error('Invalid move: ' + this.state[cell]);
        }
        this.state[cell] = player;
    };
    ;
    MatchBox.prototype.movesLeft = function () {
        var left = 0;
        for (var i = 0; i < this.gridSize * this.gridSize; i++) {
            if (this.state[i] === 2) {
                left++;
            }
        }
        return left;
    };
    ;
    // Gets the N-th row
    MatchBox.prototype.getRow = function (row) {
        var output = [];
        for (var i = row * this.gridSize; i < (row * this.gridSize) + this.gridSize; i++) {
            output.push(this.state[i]);
        }
        return output;
    };
    ;
    // Gets the N-th column
    MatchBox.prototype.getCol = function (col) {
        var output = [];
        for (var i = 0; i < this.gridSize; i++) {
            output.push(this.state[i * this.gridSize + col]);
        }
        return output;
    };
    ;
    // Gets both primary (Top-left -> Bottom-right) and secondary (Top-right -> Bottom-left) diagonals
    MatchBox.prototype.getDiagonals = function () {
        var primary = new Array();
        var secondary = new Array();
        for (var i = 0; i < this.gridSize; i++) {
            primary.push(this.state[i * this.gridSize + i]);
            secondary.push(this.state[i * this.gridSize + (this.gridSize - 1 - i)]);
        }
        return [primary, secondary];
    };
    // Checks if a sequence has all the same values
    MatchBox.prototype.isSequenceWinning = function (seq) {
        var x = seq[0];
        if (x === 2) {
            return false;
        }
        for (var i = 1; i < seq.length; i++) {
            if (seq[i] !== x) {
                return false;
            }
        }
        return true;
    };
    ;
    // Checks if rows or columns are winning
    MatchBox.prototype.isWinning = function () {
        for (var i = 0; i < this.gridSize; i++) {
            var col = this.getCol(i);
            var row = this.getRow(i);
            if (this.isSequenceWinning(col)) {
                return [true, 'col', i];
            }
            else if (this.isSequenceWinning(row)) {
                return [true, 'row', i];
            }
        }
        var diagonals = this.getDiagonals();
        if (this.isSequenceWinning(diagonals[0])) {
            return [true, 'dia', 0];
        }
        else if (this.isSequenceWinning(diagonals[1])) {
            return [true, 'dia', 1];
        }
        return [false];
    };
    ;
    MatchBox.prototype.getSymbol = function (x) {
        switch (x) {
            case 0:
                return this.O_SYMBOL;
            case 1:
                return this.X_SYMBOL;
            case 2:
            default:
                return this.__SYMBOL;
        }
    };
    ;
    MatchBox.prototype.toString = function () {
        var output = [];
        for (var i = 0; i < (this.gridSize * this.gridSize); i++) {
            if (i > 0 && i % this.gridSize == 0) {
                output.push("\n");
            }
            output.push(this.getSymbol(this.state[i]));
        }
        return output.join('');
    };
    ;
    MatchBox.prototype.generateRandomMoveset = function () {
        var legalMoves = new Array();
        for (var i = 0; i < (this.gridSize * this.gridSize); i++) {
            if (this.state[i] === 2) {
                legalMoves.push([i, this.INITIAL_MOVE_WEIGHT]);
            }
        }
        return legalMoves;
    };
    ;
    MatchBox.prototype.encode = function (state) {
        return "".concat(this.strikeSize, ".").concat((state !== null && state !== void 0 ? state : this.state).join(''));
        // return state;
        // return parseInt(`${this.gridSize} ${parseInt( state, 3 )}`);
    };
    ;
    MatchBox.prototype.rotate = function (state) {
        var n = Math.sqrt(state.length);
        if (!Number.isInteger(n)) {
            throw new Error("Grid must be a square");
        }
        var rotate0 = Array.from(state);
        var rotated90 = new Array(n * n);
        var rotated180 = new Array(n * n);
        var rotated270 = new Array(n * n);
        // 90
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var oldIndex = i * n + j;
                var newIndex = j * n + (n - 1 - i);
                // @ts-ignore
                rotated90[newIndex] = state[oldIndex];
            }
        }
        // 180
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var oldIndex = i * n + j;
                var newIndex = (n - 1 - i) * n + (n - 1 - j);
                // @ts-ignore
                rotated180[newIndex] = state[oldIndex];
            }
        }
        // 270
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var oldIndex = i * n + j;
                var newIndex = (n - 1 - j) * n + i;
                // @ts-ignore
                rotated270[newIndex] = state[oldIndex];
            }
        }
        return [rotate0, rotated90, rotated180, rotated270];
    };
    ;
    MatchBox.prototype.getValue = function (row, col) {
        return this.state[row * this.gridSize + col];
    };
    ;
    MatchBox.prototype.getFlatIndex = function (row, col) {
        return row * this.gridSize + col;
    };
    ;
    MatchBox.prototype.checkSequence = function (startRow, startCol, rowStep, colStep) {
        var firstValue = this.getValue(startRow, startCol);
        if (firstValue === 2) {
            return null;
        }
        var indices = [this.getFlatIndex(startRow, startCol)];
        for (var x = 1; x < this.strikeSize; x++) {
            var newRow = startRow + x * rowStep;
            var newCol = startCol + x * colStep;
            if (this.getValue(newRow, newCol) !== firstValue) {
                return null;
            }
            indices.push(this.getFlatIndex(newRow, newCol));
        }
        return indices;
    };
    ;
    MatchBox.prototype.findKConsecutive = function () {
        var N = this.gridSize;
        var k = this.strikeSize;
        // Check rows
        for (var i = 0; i < N; i++) {
            for (var j = 0; j <= N - k; j++) {
                var result = this.checkSequence(i, j, 0, 1);
                if (result)
                    return result;
            }
        }
        // Check columns
        for (var i = 0; i <= N - k; i++) {
            for (var j = 0; j < N; j++) {
                var result = this.checkSequence(i, j, 1, 0);
                if (result)
                    return result;
            }
        }
        // Check all diagonals (top-left to bottom-right)
        for (var i = 0; i <= N - k; i++) {
            for (var j = 0; j <= N - k; j++) {
                var result = this.checkSequence(i, j, 1, 1);
                if (result)
                    return result;
            }
        }
        // Check all diagonals (top-right to bottom-left)
        for (var i = 0; i <= N - k; i++) {
            for (var j = k - 1; j < N; j++) {
                var result = this.checkSequence(i, j, 1, -1);
                if (result)
                    return result;
            }
        }
        return null; // No k consecutive found
    };
    return MatchBox;
}());




onmessage = (e) => {
  console.log("Message received from main script");
  const workerResult = `Result: ${e.data[0] * e.data[1]}`;

  const w = new MatchBox(222222222, 3)
  console.log(w)
  console.log("Posting message back to main script");
  postMessage(w);
};