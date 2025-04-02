
import { SmartTTT } from '../SmartTTT.ts';

let game : SmartTTT;

const stats = {
  "player": 0,
  "machine": 0,
  "draws": 0
}
var MOVES = {}


/**
 * Simple weighted random selection from [element, score] pairs
 * @param {Array<[any, number]>} items - Array of [element, score] pairs
 * @returns {any} The selected element
 */
function weightedRandom(items) {
  // Calculate total weight
  const totalWeight = items.reduce((sum, [_, weight]) => sum + weight, 0);

  // Get a random value between 0 and total weight
  const random = Math.random() * totalWeight;

  // Find the selected element
  let weightSum = 0;
  for (const [element, weight] of items) {
    weightSum += weight;
    if (random < weightSum) {
      return element;
    }
  }

  // Fallback to last element (for floating point precision)
  return items[items.length - 1][0];
}

function best(items) {
  return items.sort( (a, b) => b[1] - a[1] ).map( e => e[0]).shift();
}




self.onmessage = async (e) => {

  switch (e.data[0]) {

    case "GET_TRAIN_DATA":
      return self.postMessage(['TRAIN_DATA', MOVES])

    case "TRAINING":
      console.log("loading training data...");
      console.log(e.data)
      if ("training-3x3" === e.data[1]) {
        let data = await fetch('/tic-tac-toe-nxn/pretrained-data-3x3.json')
        MOVES = await data.json()
      }
      break;

    case "NEW_GAME":
      const gridSize = parseInt(e.data[1]), strikeSize = parseInt(e.data[2])
      game = new SmartTTT(gridSize, strikeSize)
      return self.postMessage(['NEW_GAME', game.getState()]);



    case "MOVE":

      const cell = parseInt(e.data[1])
      try {
        game.makeMove(0, cell, null )
      } catch (e) {
        return self.postMessage(['ERR', e])
      }



      let strike : null | number[] = game.findKConsecutive();

      if (strike) {

        game.end(-2).forEach( ({state,moves}) => MOVES[state] = moves )
        stats.player++;
        return self.postMessage(['END', { ...game.getState(), strike: strike, winner: "player", stats: stats}])
      }

      if (game.movesLeft() === 0) {
        game.end(+1).forEach( ({state,moves}) => MOVES[state] = moves )
        stats.draws++;
        return self.postMessage(['END', { ...game.getState(), strike: null, winner: "draw", stats: stats}])
      }



      // Moves lookup
      let moves = MOVES[ game.encode(game.state) ]

      if (! moves) {
        moves = game.generateRandomMoveset()
      }


      const move = best(moves)



      try {
        game.makeMove(1, move, moves)
      } catch (e) {
        return self.postMessage(['ERR', e])
      }


      strike = game.findKConsecutive();

      if (strike) {
        game.end(+3).forEach( ({state,moves}) => MOVES[state] = moves )
        stats.machine++;
        return self.postMessage(['END', { ...game.getState(), strike: strike, winner: "machine", stats: stats}])
      }

      if (game.movesLeft() === 0) {
        game.end(+1).forEach( ({state,moves}) => MOVES[state] = moves )
        stats.draws++;
        return self.postMessage(['END', { ...game.getState(), strike: null, winner: "draw", stats: stats}])
      }

      return self.postMessage(['STATE', { ...game.getState(), moves: moves, move: move }]);

  }
};
