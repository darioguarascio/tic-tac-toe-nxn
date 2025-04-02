# Reinforcement Learning Web-Based TicTacToe

Inspired by [Salvatore Sanfilippo](https://github.com/antirez) educational [video](https://www.youtube.com/watch?v=GfwFNKCys9c) on [how matchboxes can learn to play tic-tac-toe](https://en.wikipedia.org/wiki/Matchbox_Educable_Noughts_and_Crosses_Engine), here is a web-based implementation of the same approach, extended to have a configurable grid and strike sizes.

For a better understanding of this algorithm, please refer to [Salvatore's repository](https://github.com/antirez/ttt-rl) that contains a comprehensive and detailed explaination. This tool is to visualize the process and watch the machine actually learn.

![gameplay](https://darioguarascio.github.io/tic-tac-toe-nxn/gameplay.gif)


## Install

Clone repository, run `npm install` and then `npm run dev`


## Test it

[https://darioguarascio.github.io/tic-tac-toe-nxn/](https://darioguarascio.github.io/tic-tac-toe-nxn/)

## Disclaimers

It is possible to greatly optimize the code by using grid rotations, as many board configurations are equivalent, but this has not been implemented. Moreover, despite this is a NxN grid, it becomes exponentially worse with the grid size increasing, as boards configurations are `3^(N^2)` (excluding rotations).
This is an educational experiment only.