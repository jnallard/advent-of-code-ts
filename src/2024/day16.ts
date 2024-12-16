/*
--- Day 16: Reindeer Maze ---
It's time again for the Reindeer Olympics! This year, the big event is the Reindeer Maze, where the Reindeer compete for the lowest score.

You and The Historians arrive to search for the Chief right as the event is about to start. It wouldn't hurt to watch a little, right?

The Reindeer start on the Start Tile (marked S) facing East and need to reach the End Tile (marked E). They can move forward one tile at a time (increasing their score by 1 point), but never into a wall (#). They can also rotate clockwise or counterclockwise 90 degrees at a time (increasing their score by 1000 points).

To figure out the best place to sit, you start by grabbing a map (your puzzle input) from a nearby kiosk. For example:

###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
There are many paths through this maze, but taking any of the best paths would incur a score of only 7036. This can be achieved by taking a total of 36 steps forward and turning 90 degrees a total of 7 times:


###############
#.......#....E#
#.#.###.#.###^#
#.....#.#...#^#
#.###.#####.#^#
#.#.#.......#^#
#.#.#####.###^#
#..>>>>>>>>v#^#
###^#.#####v#^#
#>>^#.....#v#^#
#^#.#.###.#v#^#
#^....#...#v#^#
#^###.#.#.#v#^#
#S..#.....#>>^#
###############
Here's a second example:

#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
In this maze, the best paths cost 11048 points; following one such path would look like this:

#################
#...#...#...#..E#
#.#.#.#.#.#.#.#^#
#.#.#.#...#...#^#
#.#.#.#.###.#.#^#
#>>v#.#.#.....#^#
#^#v#.#.#.#####^#
#^#v..#.#.#>>>>^#
#^#v#####.#^###.#
#^#v#..>>>>^#...#
#^#v###^#####.###
#^#v#>>^#.....#.#
#^#v#^#####.###.#
#^#v#^........#.#
#^#v#^#########.#
#S#>>^..........#
#################
Note that the path shown above includes one 90 degree turn as the very first move, rotating the Reindeer from facing East to facing North.

Analyze your map carefully. What is the lowest score a Reindeer could possibly get?

Your puzzle answer was 94444.

--- Part Two ---
Now that you know what the best paths look like, you can figure out the best spot to sit.

Every non-wall tile (S, ., or E) is equipped with places to sit along the edges of the tile. While determining which of these tiles would be the best spot to sit depends on a whole bunch of factors (how comfortable the seats are, how far away the bathrooms are, whether there's a pillar blocking your view, etc.), the most important factor is whether the tile is on one of the best paths through the maze. If you sit somewhere else, you'd miss all the action!

So, you'll need to determine which tiles are part of any best path through the maze, including the S and E tiles.

In the first example, there are 45 tiles (marked O) that are part of at least one of the various best paths through the maze:

###############
#.......#....O#
#.#.###.#.###O#
#.....#.#...#O#
#.###.#####.#O#
#.#.#.......#O#
#.#.#####.###O#
#..OOOOOOOOO#O#
###O#O#####O#O#
#OOO#O....#O#O#
#O#O#O###.#O#O#
#OOOOO#...#O#O#
#O###.#.#.#O#O#
#O..#.....#OOO#
###############
In the second example, there are 64 tiles that are part of at least one of the best paths:

#################
#...#...#...#..O#
#.#.#.#.#.#.#.#O#
#.#.#.#...#...#O#
#.#.#.#.###.#.#O#
#OOO#.#.#.....#O#
#O#O#.#.#.#####O#
#O#O..#.#.#OOOOO#
#O#O#####.#O###O#
#O#O#..OOOOO#OOO#
#O#O###O#####O###
#O#O#OOO#..OOO#.#
#O#O#O#####O###.#
#O#O#OOOOOOO..#.#
#O#O#O#########.#
#O#OOO..........#
#################
Analyze your map further. How many tiles are part of at least one of the best paths through the maze?

Your puzzle answer was 502.
*/


import { ConsoleCommands, formatConsoleOutput } from "../debug-helpers";
import { ArrowDirection, ArrowDirections, Coordinate, Grid } from "../grid-helpers";
import { MinHeap } from "../heap-helper";
import { execPart, execPart1, execPart2 } from "../helpers";
import { INPUT, SAMPLE_INPUT_1, SAMPLE_INPUT_2 } from "./input/input-day16";

const WALL = '#';
const START = 'S';
const END = 'E';

const mazePrintReplacements: Record<string, string> = {
    '.': ' ',
    '#': formatConsoleOutput('#', [ConsoleCommands.Hidden, ConsoleCommands.BgWhite]),
    'S': formatConsoleOutput(' ', [ConsoleCommands.BgYellow]),
    'E': formatConsoleOutput(' ', [ConsoleCommands.BgGreen]),
}

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

type Move = {
    nextPose: Coordinate,
    direction: ArrowDirection,
    cost: number,
    path: Coordinate[],
}

function getKnownCost(pose: Coordinate, direction: ArrowDirection, scoresSoFar: Record<string, number>) {
    return scoresSoFar[`${pose.id}-${direction}`] ?? Number.POSITIVE_INFINITY;
}

function setKnownCost(pose: Coordinate, direction: ArrowDirection, scoresSoFar: Record<string, number>, value: number) {
    return scoresSoFar[`${pose.id}-${direction}`] = value;
}

function isTolerable(cost: number, pose: Coordinate, direction: ArrowDirection, scoresSoFar: Record<string, number>) {
    return cost <= getKnownCost(pose, direction, scoresSoFar);
}

function getMoves(pose: Coordinate, maze: Grid, currentDirection: ArrowDirection, costSoFar: number, path: Coordinate[], scoresSoFar: Record<string, number>): Move[] {
    const moves: Move[] = [];
    const forwardPose = maze.getCoordWithTranspose(pose, ArrowDirections[currentDirection]);
    const straightCost = costSoFar + 1;
    const turnCost = costSoFar + 1000;
    if (forwardPose.value !== WALL && isTolerable(straightCost, forwardPose, currentDirection, scoresSoFar)) {
        setKnownCost(forwardPose, currentDirection, scoresSoFar, straightCost);
        moves.push({nextPose: forwardPose, direction: currentDirection, cost: costSoFar + 1, path: path.concat(forwardPose)});
    }
    const possibleTurns = TurnedArrowDirections[currentDirection];
    const possibleTurnPoses: Move[] = possibleTurns.map(t => ({type: 'turn' as 'turn', nextPose: pose, nextPoseInference: maze.getCoordWithTranspose(pose, ArrowDirections[t]), direction: t, path: path, cost: costSoFar + 1000})).filter(p => p.nextPoseInference.value !== WALL && isTolerable(turnCost, p.nextPose, p.direction, scoresSoFar));
    possibleTurnPoses.forEach(p => setKnownCost(pose, p.direction, scoresSoFar, turnCost));
    moves.push(...possibleTurnPoses);
    return moves;
}

function solveMaze(maze: Grid, findSinglePath: boolean, printBestMazes: boolean) {
    const startPose = maze.coordsByValue[START][0];
    const endPose = maze.coordsByValue[END][0];
    const scoreSoFar: Record<string, number> = {};
    const possiblePaths: Coordinate[][] = [];
    let cheapestSoFar = Number.POSITIVE_INFINITY;
    const heap = new MinHeap<Move>();
    const nextMoves = getMoves(startPose, maze, '>', 0, [startPose], scoreSoFar);
    nextMoves.forEach(move => heap.insert(move.cost, move));
    let nextMove = heap.extractMin()!.data;
    while (nextMove.cost <= cheapestSoFar) {
        if (nextMove.nextPose === endPose) {
            possiblePaths.push(nextMove.path);
            cheapestSoFar = nextMove.cost;
            if (findSinglePath) {
                return `Lowest Score: ${cheapestSoFar}`
            }
        }
        const newMoves = getMoves(nextMove.nextPose, maze, nextMove.direction, nextMove.cost, nextMove.path, scoreSoFar);
        newMoves.forEach(move => heap.insert(move.cost, move));
        nextMove = heap.extractMin()!.data;
    }
    if (printBestMazes) {
        possiblePaths.forEach(p => maze.print({characterReplacements: mazePrintReplacements, highlightCoord: endPose, path: p, doubleWidth: true}));
    }
    const set = new Set(possiblePaths.flat())
    return `Lowest Score: ${cheapestSoFar}.\tBest Seats: ${set.size}`;
}

execPart(() => {
    const {maze} = sharedSetup(SAMPLE_INPUT_1);
    return solveMaze(maze, false, true);
}, 'Sample 1')

execPart(() => {
    const {maze} = sharedSetup(SAMPLE_INPUT_2);
    return solveMaze(maze, false, true);
}, 'Sample 2');

execPart1(() => {
    const {maze} = sharedSetup();
    return solveMaze(maze, true, false);
});

execPart2(() => {
    const {maze} = sharedSetup();
    return solveMaze(maze, false, false);
});
