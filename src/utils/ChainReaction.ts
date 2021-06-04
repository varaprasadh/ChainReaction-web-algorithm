interface Position {
    row: number,
    column: number
};

interface Player {
    id: string,
    name?: string,
    color?: string
};

interface Cell{
    id?: string, // no use for now
    val: number,
    owner: Player | null,
    capacity: number,
    items: Array<CellItem>,
    position: Position
};

// later 
interface CellItem{
    id?: string,
    position: Position
}

type Board = Array<Array<Cell>>;

export class ChainReaction{
    currentPlayer:Player;
    board:Board;
    constructor(){
        // do something
        this.currentPlayer = {
            id: "assume_its_uuid",
            name:"john doe",
            color:"red"
        };
        this.board = this.initializeBoard(4,4);
    };

    initializeBoard(rows:number,columns:number):Board{

        const board:Board = [];
        for(let i=0;i<rows;i++){
            const row:Array<Cell> = [];
            for(let j=0;j<columns;j++){

               // corners
               if(
                ( i=== 0 && j===0 )  || // top left
                ( i=== 0 && j === columns-1) || // top right
                ( i=== rows-1 && j === 0) || // bottom left
                ( i=== rows-1 && j === columns-1)  // bottom right: ;
                ){
                   row.push({
                       val: 0,
                       owner: null,
                       capacity: 1,
                       items: [],
                       position: {
                           row:i,
                           column:j
                       }
                   });
                   continue;
               }

               if( 
                   (i===0 || i=== rows-1) || // top edge and bottom edge
                   (j===0 || j=== columns-1) // left and right edges
               ){

                   row.push({
                       val: 0,
                       owner: null,
                       capacity: 2,
                       items: [],
                       position: {
                           row: i,
                           column: j
                       }
                   });
                   continue;
               }



               row.push({
                  val: 0,
                  owner: null,
                  capacity: 3 ,
                  items: [],
                   position: {
                       row: i,
                       column: j
                   }
               });
            };
            board.push(row);
        }

        

        return board;
    }

    printBoard(){
        const str = this.board.map(row => {
            return row.map(cell => `${cell.items.length}`).join(" | ")
        }).join("\n");
        console.log(str);
    }
    isValidPosition = (board:Board, position : Position):boolean => {
        // check current cell and player state 

        const {  row, column  } = position;
        if(row<0 || row >= board.length){
            return false;
        };
        if(column < 0 || column >= board[row].length){
            return false;
        }
       return true;
    };

    isValidPlayer(board: Board,position:Position, player:Player){
        const { row, column } = position;

        const cell: Cell = this.getCell(board, position);

        if (cell.owner && cell.owner.id !== player.id) {
            return false;
        }
        return true;
    }

    nextPlayer(){

    };

    getCell(board:Board, position:Position){
        if(!this.isValidPosition(board, position)){
            console.log("invalid position");
            throw new Error("Error in getCell");
        }
        const { row, column } = position;

        const cell: Cell = board[row][column];

        return cell;
    };


    nextState(prevState: Board , position: Position){
        // level order traversal;
        const states = [];

        // TODO validate the player as well, 
        // can put in a empty cell,
        // can put in their cell, +1 💟 
    
        
        const queue = [];
        

        if(!this.isValidPosition(prevState, position)){
            console.log("cant do the operation");
           throw new Error("its not valid position");
        };

        const cell = this.getCell(prevState, position);
        cell.items.push({
            position: position
        });

        queue.push(cell);
        queue.push(null);

        while(queue.length > 0){ 

            let cell = queue.shift();
            while(cell){
                    if (this.isValidPosition(prevState, cell.position)) {
                        // check if it can explode
                        if (cell.items.length > cell.capacity){
                            // share the atoms to neighbors <==> exploding
                            const neighborPositions = this.getNeighbors(prevState, cell.position);
                            for (const pos of neighborPositions) {
                                const neighbor = this.getCell(prevState, pos);
                                if (cell.items.length) {
                                    neighbor.items.push(cell.items.pop() as any); // keep an eye
                                }
                                // if neighbor can explode
                                if (neighbor.items.length > neighbor.capacity) {
                                    queue.push(neighbor);
                                }
                            };
                        }
                    }
                cell = queue.shift();
            };
            if(queue.length){
                queue.push(null);
            };
            console.log("\n");
            this.printBoard();
            
            states.push(JSON.parse(JSON.stringify(prevState)));
        }
        return {
            board: prevState,
            states
        };
    }

    printBoards(states: Array<Board>){
        states.forEach((state,index) => {
            const str = state.map(row => {
                return row.map(cell => `${cell.items.length}`).join(" | ")
            }).join("\n");
            console.log(`level::${index} \n`);
            console.log(str);
            console.log("\n");
        });
    };

    // returns neighbor positions ? should return cell instead ? 
    getNeighbors(board:Board, position: Position):Array<Position> {
        if (!this.isValidPosition(board, position)) {
            console.log("invalid position");
            throw new Error("Error in getCell");
        };

        const neighbors: Array<Position> = []


        const {  row, column } = position;
        // -- corners --
        // top left,
        if(row === 0 && column === 0){
            const a = {
                row: row,
                column: column + 1
            };
            if(this.isValidPosition(board, a)){
                neighbors.push(a);
            };
            const b = {
                row: row+1,
                column: column
            };
            if(this.isValidPosition(board, b)){
                neighbors.push(b);
            };
            return neighbors;
        };
        // top right
        if(row === 0 && column === board[row].length-1){
            const a = {
                row: row,
                column: column - 1
            };
            if (this.isValidPosition(board, a)) {
                neighbors.push(a);
            };
            const b = {
                row: row + 1,
                column: column
            };
            if (this.isValidPosition(board, b)) {
                neighbors.push(b);
            };
            return neighbors;
        }

        // bottom left
        if(row === board.length-1 && column === 0){
            const a = {
                row: row-1,
                column: column 
            };
            if (this.isValidPosition(board, a)) {
                neighbors.push(a);
            };
            const b = {
                row: row,
                column: column+1
            };
            if (this.isValidPosition(board, b)) {
                neighbors.push(b);
            };
            return neighbors;
        }

        // bottom right
        if(row === board.length-1 && column === board[row].length-1){
            const a = {
                row: row-1,
                column: column 
            };
            if (this.isValidPosition(board, a)) {
                neighbors.push(a);
            };
            const b = {
                row: row,
                column: column-1
            };
            if (this.isValidPosition(board, b)) {
                neighbors.push(b);
            };
            return neighbors;
        };


        // -- edges 

        // top boundary
        if(row === 0){
            // 3 neighbors
            const a = {
                row: row,
                column: column-1
            };
            const b = {
                row: row ,
                column: column +1
            };
            const c = {
                row: row + 1,
                column: column
            };

            this.isValidPosition(board,a) && neighbors.push(a); 
            this.isValidPosition(board,b) && neighbors.push(b); 
            this.isValidPosition(board,c) && neighbors.push(c); 

            return neighbors;
        };

        // right boundary
        if(column === board[row].length-1){
            // 3 neighbors
            const a = {
                row: row-1,
                column: column
            };
            const b = {
                row: row +1 ,
                column: column 
            };
            const c = {
                row: row ,
                column: column-1
            };

            this.isValidPosition(board,a) && neighbors.push(a); 
            this.isValidPosition(board,b) && neighbors.push(b); 
            this.isValidPosition(board,c) && neighbors.push(c); 
            
            return neighbors;


        };

        // bottom boundary
        if(row === board[row].length-1){
            // 3 neighbors
            const a = {
                row: row,
                column: column-1
            };
            const b = {
                row: row ,
                column: column +1 
            };
            const c = {
                row: row-1 ,
                column: column
            };

            this.isValidPosition(board,a) && neighbors.push(a); 
            this.isValidPosition(board,b) && neighbors.push(b); 
            this.isValidPosition(board,c) && neighbors.push(c); 

            return neighbors;

        };

        // left boundary
        if(row === board[row].length-1){
            // 3 neighbors
            const a = {
                row: row-1,
                column: column
            };
            const b = {
                row: row +1,
                column: column 
            };
            const c = {
                row: row ,
                column: column +1
            };

            this.isValidPosition(board,a) && neighbors.push(a); 
            this.isValidPosition(board,b) && neighbors.push(b); 
            this.isValidPosition(board,c) && neighbors.push(c); 

            return neighbors;
        };

        // top cell
        const a = {
            row: row -1,
            column: column 
        };
        
        // bottom cell
        const b = {
            row: row + 1,
            column: column 
        };
        
        // left cell
        const c = {
            row: row,
            column: column -1
        };
        
        const d = {
            row: row ,
            column: column +1 
        };
        
        

        this.isValidPosition(board, a) && neighbors.push(a);
        this.isValidPosition(board, b) && neighbors.push(b);
        this.isValidPosition(board, c) && neighbors.push(c);
        this.isValidPosition(board, d) && neighbors.push(d);
        
        return neighbors
    }

}

export default ChainReaction;
