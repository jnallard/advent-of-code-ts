/*

*/


import { ArrowDirection, ArrowDirections, Coordinate, CoordinateTransponse, E, Grid, N, S, W } from "../grid-helpers";
import { execExamplePart1, execExamplePart2, execPart1, execPart2, sum } from "../helpers";
import { INPUT_WAREHOUSE, INPUT_MOVES, SMALL_SAMPLE_INPUT_WAREHOUSE, SMALL_SAMPLE_INPUT_MOVES, BIG_SAMPLE_INPUT_WAREHOUSE, BIG_SAMPLE_INPUT_MOVES } from "./input/input-day15";

const WALL = '#';
const ROBOT = '@';
const BOX = 'O';
const OPEN_SPACE = '.';

function sharedSetup(widen: boolean, warehouseInput: string = INPUT_WAREHOUSE, movesInput: string = INPUT_MOVES) {
    if (widen) {
        warehouseInput = warehouseInput
            .replaceAll('#', '##')
            .replaceAll('O', '[]')
            .replaceAll('.', '..')
            .replaceAll('@', '@.');
    }
    const warehouse = new Grid(warehouseInput.split('\n').filter(l => !!l));
    const moves = movesInput.split('\n').filter(l => !!l).join('').split('') as ArrowDirection[];
    // console.log({warehouse, moves});
    return {warehouse, moves};
}

function makeMove(warehouse: Grid, arrow: ArrowDirection, robotPose: Coordinate) {
    const direction = ArrowDirections[arrow];
    const nextMove = warehouse.getCoordWithTranspose(robotPose, direction);
    if (nextMove.value === WALL) {
        // console.log('wall');
        return robotPose;
    }
    if (nextMove.value === OPEN_SPACE) {
        // console.log('moves');
        nextMove.value = ROBOT;
        robotPose.value = OPEN_SPACE;
        return nextMove;
    }
    if (nextMove.value === BOX) {
        const boxes = warehouse.getNeighbors(robotPose, {directions: [direction], recursive: true, valuesToMatch: [BOX]});
        // console.log(boxes);
        const lastBox = boxes[boxes.length - 1];
        const afterLastBox = warehouse.getCoordWithTranspose(lastBox, direction);
        if (afterLastBox.value === WALL) {
            // console.log('wall after boxes');
            return robotPose;
        }
        // console.log('moved boxes');
        afterLastBox.value = BOX;
        robotPose.value = OPEN_SPACE;
        nextMove.value = ROBOT;
        return nextMove;
    }
    // console.log(direction, robotPose);
    // warehouse.print();
    throw 'what do i do'
}

function calculateGpsScore(box: Coordinate) {
    return (100 * box.row) + box.col;
}

function makeAllMoves(warehouse: Grid, moves: ArrowDirection[]) {
    let robotPose = warehouse.coordsByValue[ROBOT][0];
    for (let move of moves) {
        // console.log(move, robotPose);
        robotPose = makeMove(warehouse, move, robotPose);
        // warehouse.print();
    }
    warehouse.updateCoordMap();
    const boxes = warehouse.coordsByValue[BOX];
    return sum(boxes.map(b => calculateGpsScore(b)));
}

execExamplePart1(() => {
    const {warehouse, moves} = sharedSetup(false, SMALL_SAMPLE_INPUT_WAREHOUSE, SMALL_SAMPLE_INPUT_MOVES);
    return makeAllMoves(warehouse, moves);
}, 'small example')

execExamplePart1(() => {
    const {warehouse, moves} = sharedSetup(false, BIG_SAMPLE_INPUT_WAREHOUSE, BIG_SAMPLE_INPUT_MOVES);
    return makeAllMoves(warehouse, moves);
}, 'big example')

// execExamplePart2(() => {
//         const {warehouse, moves} = sharedSetup(true, SMALL_SAMPLE_INPUT_WAREHOUSE, SMALL_SAMPLE_INPUT_MOVES);
//         return makeAllMoves(warehouse, moves);
// }, 'small example')

execPart1(() => {
    const {warehouse, moves} = sharedSetup(false);
    return makeAllMoves(warehouse, moves);
})

// execPart2(() => {
//     const {lines} = sharedSetup();
//     return 'TBD';
// })

