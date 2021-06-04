import { ChainReaction } from "./utils/ChainReaction";


const cr = new ChainReaction();

// case 1
// cr.nextState(cr.board,{ row:0, column: 2});
// cr.nextState(cr.board,{ row:0, column: 2});

// cr.nextState(cr.board,{ row:1, column: 1});
// cr.nextState(cr.board,{ row:1, column: 1});
// cr.nextState(cr.board,{ row:1, column: 1});

// cr.nextState(cr.board,{ row:1, column: 2});
// cr.nextState(cr.board,{ row:1, column: 2});
// cr.nextState(cr.board,{ row:1, column: 2});

// cr.nextState(cr.board,{ row:1, column: 3});
// cr.nextState(cr.board,{ row:1, column: 3});

// const { states } = cr.nextState(cr.board, { row: 0, column: 2 });
/*
0 | 2 | 2 | 0
1 | 0 | 2 | 1
0 | 1 | 1 | 1
0 | 0 | 0 | 0
*/


// case II

cr.nextState(cr.board,{ row:2, column: 0});
cr.nextState(cr.board,{ row:2, column: 0});

cr.nextState(cr.board,{ row:3, column: 0});


// check 
export const { states } = cr.nextState(cr.board,{ row:3, column: 0});

console.log(cr.printBoards(states));



