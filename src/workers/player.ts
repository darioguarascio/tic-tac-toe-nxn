import { TicTacToeNK } from '../Player.js';



self.onmessage = (e) => {
  const state = e.data[1].split('').map( (e) => parseInt(e) )

  const game = new TicTacToeNK(state, e.data[2]);


  if (new Set(state).size == 1 && state[0] == 2) {
    e.data[0] = 'random';
  }

  let move;
  switch (e.data[0]) {
    case "optimal":
      move = game.getBestMove();
      break;

    case "random":
      move = game.getRandomMove();
      break
  }

  return self.postMessage( move );

}
