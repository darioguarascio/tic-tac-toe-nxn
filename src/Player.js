
export class TicTacToeNK {
  constructor(gameState, strikeLength) {
    if (!Array.isArray(gameState)) {
      throw new Error('Game state must be an array');
    }

    // Infer board size from game state using square root
    const boardLength = gameState.length;
    this.size = Math.sqrt(boardLength);

    // Validate that the board is a perfect square
    if (!Number.isInteger(this.size)) {
      throw new Error('Game state length must be a perfect square');
    }

    this.strikeLength = strikeLength;
    this.board = [...gameState];

    // Count moves to determine current player
    this.moves = this.board.filter(cell => cell !== 2).length;
    this.currentPlayer = this.moves % 2 === 0 ? 0 : 1; // 0 = player1, 1 = player2
    this.winningCombos = this.calculateWinningCombos();
  }

  // Calculate all possible winning combinations based on size and strikeLength
  calculateWinningCombos() {
    const combos = [];

    // Horizontal wins
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col <= this.size - this.strikeLength; col++) {
        const combo = [];
        for (let k = 0; k < this.strikeLength; k++) {
          combo.push(row * this.size + (col + k));
        }
        combos.push(combo);
      }
    }

    // Vertical wins
    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row <= this.size - this.strikeLength; row++) {
        const combo = [];
        for (let k = 0; k < this.strikeLength; k++) {
          combo.push((row + k) * this.size + col);
        }
        combos.push(combo);
      }
    }

    // Diagonal wins (top-left to bottom-right)
    for (let row = 0; row <= this.size - this.strikeLength; row++) {
      for (let col = 0; col <= this.size - this.strikeLength; col++) {
        const combo = [];
        for (let k = 0; k < this.strikeLength; k++) {
          combo.push((row + k) * this.size + (col + k));
        }
        combos.push(combo);
      }
    }

    // Diagonal wins (top-right to bottom-left)
    for (let row = 0; row <= this.size - this.strikeLength; row++) {
      for (let col = this.strikeLength - 1; col < this.size; col++) {
        const combo = [];
        for (let k = 0; k < this.strikeLength; k++) {
          combo.push((row + k) * this.size + (col - k));
        }
        combos.push(combo);
      }
    }

    return combos;
  }

  // Get available moves
  getAvailableMoves() {
    return this.board.map((cell, index) => cell === 2 ? index : null).filter(index => index !== null);
  }

  // Make a move
  makeMove(index, player = this.currentPlayer) {
    if (this.board[index] === 2) {
      this.board[index] = player;
      this.moves++;
      this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
      return true;
    }
    return false;
  }

  // Undo a move
  undoMove(index) {
    if (index >= 0 && index < this.board.length && this.board[index] !== 2) {
      this.board[index] = 2; // Reset to empty
      this.moves--;
      this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
      return true;
    }
    return false;
  }

  // Check for a winner
  checkWinner() {
    for (const combo of this.winningCombos) {
      const firstCell = this.board[combo[0]];
      if (firstCell !== 2 && combo.every(index => this.board[index] === firstCell)) {
        return { winner: firstCell, combo };
      }
    }
    return null;
  }

  // Check if the game is over
  isGameOver() {
    return this.checkWinner() || this.moves === this.size * this.size;
  }

  // Evaluate the board (for minimax)
  evaluate() {
    const winResult = this.checkWinner();
    if (winResult) {
      return winResult.winner === 0 ? 10 : -10; // Player 0 is maximizing
    }
    return 0;
  }
// Minimax algorithm with alpha-beta pruning
minimax(depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
  if (this.isGameOver()) {
    const score = this.evaluate();
    return { score };
  }

  const availableMoves = this.getAvailableMoves();
  let bestMoves = [];

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      this.makeMove(move, 0); // Player 0 is maximizing
      const result = this.minimax(depth + 1, false, alpha, beta);
      this.undoMove(move);

      if (result.score > bestScore) {
        bestScore = result.score;
        bestMoves = [move]; // Reset to a new array with just this move
      } else if (result.score === bestScore) {
        bestMoves.push(move); // Add this move to equally good moves
      }

      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return { score: bestScore, moves: bestMoves };
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      this.makeMove(move, 1); // Player 1 is minimizing
      const result = this.minimax(depth + 1, true, alpha, beta);
      this.undoMove(move);

      if (result.score < bestScore) {
        bestScore = result.score;
        bestMoves = [move]; // Reset to a new array with just this move
      } else if (result.score === bestScore) {
        bestMoves.push(move); // Add this move to equally good moves
      }

      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return { score: bestScore, moves: bestMoves };
  }
}

// Get the best move without actually making it
getBestMove() {
  if (this.isGameOver()) return null;

  const isMaximizing = this.currentPlayer === 0;
  const result = this.minimax(0, isMaximizing);

  if (result.moves && result.moves.length > 0) {
    // Pick a random move from the list of equally good moves
    return result.moves[ Math.floor(Math.random() * result.moves.length) ];
  }
  return null;
}

  getRandomMove() {
    if (this.isGameOver()) return null;

    const availableMoves = this.getAvailableMoves();

    return availableMoves[ Math.floor( Math.random() * availableMoves.length) ]
  }


}
