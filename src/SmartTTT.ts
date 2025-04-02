export class SmartTTT {

  readonly INITIAL_MOVE_WEIGHT: number = 3;

  gridSize: number;
  strikeSize: number;
  state: any[];

  movesHistory: any[];

  // Generates a NxN item
  constructor(gridSize: number, strikeSize: number) {
    this.gridSize = gridSize;
    this.strikeSize = strikeSize;
    this.state = new Array( gridSize * gridSize ).fill(2);
    this.movesHistory = new Array();
  };

  makeMove(player: number, cell: number | undefined, moves: Array<[ number, number ]> | null) : void {
    // console.log([cell, this.state])
    if (typeof(cell) == 'undefined' || this.state.length < cell || cell < 0) {
      throw new Error('Invalid cell:' + cell)
    }
    if (this.state[ cell ] !== 2) {
      throw new Error('Invalid move: ' + this.state[cell])
    }

    // Save state before altering it
    this.movesHistory.push([player, cell, Array.from(this.state), moves])

    this.state[ cell ] = player;

  };

  movesLeft() : number {
    let left = 0;
    for (let i = 0; i < this.gridSize*this.gridSize; i++) {
      if (this.state[i] === 2) {
        left++;
      }
    }
    return left;
  };


  generateRandomMoveset() : Array<[ number, number ]> {
    const legalMoves : Array<[number, number]> = new Array();

    for (let i = 0; i < (this.gridSize * this.gridSize); i++) {
      if (this.state[i] === 2) {
        legalMoves.push([ i, this.INITIAL_MOVE_WEIGHT ])
      }
    }
    return legalMoves;

  };

  encode(state: number[] | null): string {
    return `${this.strikeSize}.${ ( state ?? this.state).join('')}`;
    // return state;
    // return parseInt(`${this.gridSize} ${parseInt( state, 3 )}`);
  };

/*
  rotate(state: number[]): [ number[], number[], number[], number[] ] {
    const n = Math.sqrt(state.length);
    if (!Number.isInteger(n)) {
      throw new Error("Grid must be a square");
    }
    const rotate0 = Array.from(state);
    const rotated90: number[] = new Array(n*n);
    const rotated180: number[] = new Array(n*n);
    const rotated270: number[] = new Array(n*n);

      // 90
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const oldIndex = i * n + j;
        const newIndex = j * n + (n - 1 - i);
        // @ts-ignore
        rotated90[newIndex] = state[oldIndex];
      }
    }

      // 180
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const oldIndex = i * n + j;
        const newIndex = (n - 1 - i) * n + (n - 1 - j);
        // @ts-ignore
        rotated180[newIndex] = state[oldIndex];
      }
    }

      // 270
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const oldIndex = i * n + j;
        const newIndex = (n - 1 - j) * n + i;
        // @ts-ignore
        rotated270[newIndex] = state[oldIndex];
      }
    }

    return [ rotate0, rotated90, rotated180, rotated270 ];
  };
*/

  getValue(row: number, col: number): number {
    return this.state[row * this.gridSize + col];
  };

  getFlatIndex(row: number, col: number): number {
    return row * this.gridSize + col;
  };

  checkSequence(startRow: number, startCol: number, rowStep: number, colStep: number) : null | number[] {
    let firstValue = this.getValue(startRow, startCol);
    if (firstValue === 2) {
      return null;
    }
    let indices = [this.getFlatIndex(startRow, startCol)];

    for (let x = 1; x < this.strikeSize; x++) {
      let newRow = startRow + x * rowStep;
      let newCol = startCol + x * colStep;
      if (this.getValue(newRow, newCol) !== firstValue) {
        return null;
      }
      indices.push(this.getFlatIndex(newRow, newCol));
    }
    return indices;
  };



  findKConsecutive() : null | number[] {
    const N = this.gridSize;
    const k = this.strikeSize;

    // Check rows
    for (let i = 0; i < N; i++) {
        for (let j = 0; j <= N - k; j++) {
            let result = this.checkSequence(i, j, 0, 1);
            if (result) return result;
        }
    }

    // Check columns
    for (let i = 0; i <= N - k; i++) {
        for (let j = 0; j < N; j++) {
            let result = this.checkSequence(i, j, 1, 0);
            if (result) return result;
        }
    }

    // Check all diagonals (top-left to bottom-right)
    for (let i = 0; i <= N - k; i++) {
        for (let j = 0; j <= N - k; j++) {
            let result = this.checkSequence(i, j, 1, 1);
            if (result) return result;
        }
    }

    // Check all diagonals (top-right to bottom-left)
    for (let i = 0; i <= N - k; i++) {
        for (let j = k - 1; j < N; j++) {
            let result = this.checkSequence(i, j, 1, -1);
            if (result) return result;
        }
    }

    return null; // No k consecutive found
  };

  getState() {
    return {
      state: this.state
    }
  };

/*
*/


  end(reward: number) {
    let movesList = this.movesHistory;
    let output : Array<any> = []

    for (let move of movesList) {
      if (move[0] == 1) { // if player is machine
        for (let i in move[3]) {
          if (move[3][i][0] === move[1]) {
            move[3][i][1] = parseInt( move[3][i][1]) + parseInt( reward )
          }
        }
        output.push({
          state: this.encode(move[2]),
          moves: move[3]
        })

      }
    }
    return output;
  }




}

