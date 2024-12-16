/*

*/


import { ArrowDirection, ArrowDirections, Coordinate, E, Grid, W } from "../grid-helpers";
import { execExamplePart1, execExamplePart2, execPart1, execPart2, sum } from "../helpers";
import { BIG_SAMPLE_INPUT_MOVES, BIG_SAMPLE_INPUT_WAREHOUSE, INPUT_MOVES, INPUT_WAREHOUSE, SMALL_SAMPLE_INPUT_MOVES, SMALL_SAMPLE_INPUT_WAREHOUSE } from "./input/input-day15";

const WALL = '#';
const ROBOT = '@';
const BOX = 'O';
const LEFT_BOX = '[';
const RIGHT_BOX = ']';
const OPEN_SPACE = '.';

const WallException = 'wall';

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
    return {warehouse, moves};
}

function getAllBoxesVertically(warehouse: Grid, arrow: ArrowDirection, pose: Coordinate, allBoxes: Record<string, Coordinate> = {}) {
    if (allBoxes[pose.id] !== undefined) {
        return Object.values(allBoxes);
    }
    const direction = ArrowDirections[arrow];
    const boxHalves = warehouse.getNeighbors(pose, {directions: [direction], recursive: true, valuesToMatch: [LEFT_BOX, RIGHT_BOX]});
    const lastBox = boxHalves[boxHalves.length - 1];
    const nextPose = warehouse.getCoordWithTranspose(lastBox, direction);
    if (nextPose.value === WALL) {
        throw WallException;
    }
    const otherHalves = boxHalves.map(b => warehouse.getCoordWithTranspose(b, b.value === ']' ? W : E));
    boxHalves.forEach(b => allBoxes[b.id] = b);
    otherHalves.forEach(b => getAllBoxesVertically(warehouse, arrow, b, allBoxes));
    return Object.values(allBoxes);
}

function makeMove(warehouse: Grid, arrow: ArrowDirection, robotPose: Coordinate) {
    const direction = ArrowDirections[arrow];
    const nextMove = warehouse.getCoordWithTranspose(robotPose, direction);
    if (nextMove.value === WALL) {
        return robotPose;
    }
    if (nextMove.value === OPEN_SPACE) {
        nextMove.value = ROBOT;
        robotPose.value = OPEN_SPACE;
        return nextMove;
    }
    if (nextMove.value === BOX) {
        const boxes = warehouse.getNeighbors(robotPose, {directions: [direction], recursive: true, valuesToMatch: [BOX]});
        const lastBox = boxes[boxes.length - 1];
        const afterLastBox = warehouse.getCoordWithTranspose(lastBox, direction);
        if (afterLastBox.value === WALL) {
            return robotPose;
        }
        afterLastBox.value = BOX;
        robotPose.value = OPEN_SPACE;
        nextMove.value = ROBOT;
        return nextMove;
    }
    if (arrow === '>' || arrow === '<') {
        const boxes = warehouse.getNeighbors(robotPose, {directions: [direction], recursive: true, valuesToMatch: [LEFT_BOX, RIGHT_BOX]});
        const lastBox = boxes[boxes.length - 1];
        const afterLastBox = warehouse.getCoordWithTranspose(lastBox, direction);
        if (afterLastBox.value === WALL) {
            return robotPose;
        }
        boxes.forEach(b => b.value = b.value === LEFT_BOX ? RIGHT_BOX : LEFT_BOX);
        afterLastBox.value = arrow === '>' ? RIGHT_BOX : LEFT_BOX;
        robotPose.value = OPEN_SPACE;
        nextMove.value = ROBOT;
        return nextMove;
    }
    try {
        const allBoxesVertically = getAllBoxesVertically(warehouse, arrow, robotPose);
        const clonedCoords = allBoxesVertically.map(c => ({...c} as Coordinate));
        allBoxesVertically.forEach(b => b.value = OPEN_SPACE);
        clonedCoords.forEach(b => warehouse.getCoordWithTranspose(b, direction).value = b.value);
        robotPose.value = OPEN_SPACE;
        nextMove.value = ROBOT;
        return nextMove;
    } catch (e) {
        if (e === WallException) {
            // Hit a wall at some point, so can't move anything;
            return robotPose;
        }
        throw e;
    }
}

function calculateGpsScore(box: Coordinate) {
    return (100 * box.row) + box.col;
}

function makeAllMoves(warehouse: Grid, moves: ArrowDirection[]) {
    let robotPose = warehouse.coordsByValue[ROBOT][0];
    for (let move of moves) {
        robotPose = makeMove(warehouse, move, robotPose);
    }
    warehouse.updateCoordMap();
    const boxes = [...warehouse.coordsByValue[BOX] ?? [], ...warehouse.coordsByValue[LEFT_BOX] ?? []];
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

execExamplePart2(() => {
        const {warehouse, moves} = sharedSetup(true, SMALL_SAMPLE_INPUT_WAREHOUSE, SMALL_SAMPLE_INPUT_MOVES);
        return makeAllMoves(warehouse, moves);
}, 'small example')

execExamplePart2(() => {
    const {warehouse, moves} = sharedSetup(true, BIG_SAMPLE_INPUT_WAREHOUSE, BIG_SAMPLE_INPUT_MOVES);
    return makeAllMoves(warehouse, moves);
}, 'big example')

execPart1(() => {
    const {warehouse, moves} = sharedSetup(false);
    return makeAllMoves(warehouse, moves);
})

execPart2(() => {
        const {warehouse, moves} = sharedSetup(true);
        return makeAllMoves(warehouse, moves);
})

