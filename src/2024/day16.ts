/*

*/


import { ArrowDirection, ArrowDirections, Coordinate, CoordinateTransponse, Directions, Grid } from "../grid-helpers";
import { execExamplePart1, execExamplePart2, execPart1, execPart2 } from "../helpers";
import { INPUT, SAMPLE_INPUT } from "./input/input-day16";

const WALL = '#';
const START = 'S';
const END = 'E';
const OPEN_SPACE = '.';

export const TurnedArrowDirections: Record<ArrowDirection, ArrowDirection[]> = {
    '^': ['<', '>'],
    '>': ['^', 'v'],
    'v': ['<', '>'],
    '<': ['^', 'v'],
}

function sharedSetup(input: string = INPUT) {
    const lines = input.split('\n').filter(l => !!l);
    const maze = new Grid(lines);
    return {maze};
}

function solvePose(pose: Coordinate, currentDirection: ArrowDirection, costSoFar: number, maze: Grid, scoresSoFar: Record<string, number>, path: Coordinate[]) {
    path.push(pose);
    // console.log({pose, currentDirection, costSoFar});
    // maze.print(false, pose, path);
    if (pose.value === WALL) {
        // console.log('wall');
        return Number.POSITIVE_INFINITY;
    }
    if (pose.value === END) {
        // maze.print(false, pose, path);
        // console.log('end');
        return costSoFar;
    }
    if (costSoFar >= (scoresSoFar[pose.id] ?? Number.POSITIVE_INFINITY)) {
        // console.log('seen lower before');
        // If we already checked this cell and got a lower value before, don't consider this path
        return Number.POSITIVE_INFINITY;
    }
    // console.log('checking other directions');
    scoresSoFar[pose.id] = costSoFar;
    const straightDirectionPose = maze.getCoordWithTranspose(pose, ArrowDirections[currentDirection]);
    const scores: number[] = [];
    if (straightDirectionPose.value !== WALL) {
        scores.push(solvePose(straightDirectionPose, currentDirection, costSoFar + 1, maze, scoresSoFar, [...path]));
    }

    const possibleTurns = TurnedArrowDirections[currentDirection];
    const possiblePoses = possibleTurns.map(t => ({newPose: maze.getCoordWithTranspose(pose, ArrowDirections[t]), newTurn: t}));
    scores.push(...possiblePoses.map(({newPose, newTurn}) => solvePose(newPose, newTurn, costSoFar + 1001, maze, scoresSoFar, [...path])));
    const lowerScore = Math.min(...scores);


    return lowerScore;
}

function solveMaze(maze: Grid) {
    const startPose = maze.coordsByValue[START][0];
    const scoresSoFar: Record<string, number> = {};
    // scoresSoFar[startPose.id] = -1;
    const lowestScore = solvePose(startPose, '>', 0, maze, scoresSoFar, []);
    // console.log(scoresSoFar);
    return lowestScore;
}

execExamplePart1(() => {
    const {maze} = sharedSetup(SAMPLE_INPUT);
    return solveMaze(maze);
})

// execExamplePart2(() => {
//     const {lines} = sharedSetup(SAMPLE_INPUT);
//     return 'TBD';
// })

execPart1(() => {
    const {maze} = sharedSetup();
    return solveMaze(maze);
})

// execPart2(() => {
//     const {lines} = sharedSetup();
//     return 'TBD';
// })

