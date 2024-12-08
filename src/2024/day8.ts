/*
--- Day 8: Resonant Collinearity ---
You find yourselves on the roof of a top-secret Easter Bunny installation.

While The Historians do their thing, you take a look at the familiar huge antenna. Much to your surprise, it seems to have been reconfigured to emit a signal that makes people 0.1% more likely to buy Easter Bunny brand Imitation Mediocre Chocolate as a Christmas gift! Unthinkable!

Scanning across the city, you find that there are actually many such antennas. Each antenna is tuned to a specific frequency indicated by a single lowercase letter, uppercase letter, or digit. You create a map (your puzzle input) of these antennas. For example:

............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
The signal only applies its nefarious effect at specific antinodes based on the resonant frequencies of the antennas. In particular, an antinode occurs at any point that is perfectly in line with two antennas of the same frequency - but only when one of the antennas is twice as far away as the other. This means that for any pair of antennas with the same frequency, there are two antinodes, one on either side of them.

So, for these two antennas with frequency a, they create the two antinodes marked with #:

..........
...#......
..........
....a.....
..........
.....a....
..........
......#...
..........
..........
Adding a third antenna with the same frequency creates several more antinodes. It would ideally add four antinodes, but two are off the right side of the map, so instead it adds only two:

..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......#...
..........
..........
Antennas with different frequencies don't create antinodes; A and a count as different frequencies. However, antinodes can occur at locations that contain antennas. In this diagram, the lone antenna with frequency capital A creates no antinodes but has a lowercase-a-frequency antinode at its location:

..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......A...
..........
..........
The first example has antennas with two different frequencies, so the antinodes they create look like this, plus an antinode overlapping the topmost A-frequency antenna:

......#....#
...#....0...
....#0....#.
..#....0....
....0....#..
.#....A.....
...#........
#......#....
........A...
.........A..
..........#.
..........#.
Because the topmost A-frequency antenna overlaps with a 0-frequency antinode, there are 14 total unique locations that contain an antinode within the bounds of the map.

Calculate the impact of the signal. How many unique locations within the bounds of the map contain an antinode?

Your puzzle answer was 381.

--- Part Two ---
Watching over your shoulder as you work, one of The Historians asks if you took the effects of resonant harmonics into your calculations.

Whoops!

After updating your model, it turns out that an antinode occurs at any grid position exactly in line with at least two antennas of the same frequency, regardless of distance. This means that some of the new antinodes will occur at the position of each antenna (unless that antenna is the only one of its frequency).

So, these three T-frequency antennas now create many antinodes:

T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........
In fact, the three T-frequency antennas are all exactly in line with two antennas, so they are all also antinodes! This brings the total number of antinodes in the above example to 9.

The original example now has 34 antinodes, including the antinodes that appear on every antenna:

##....#....#
.#.#....0...
..#.#0....#.
..##...0....
....0....#..
.#...#A....#
...#..#.....
#....#.#....
..#.....A...
....#....A..
.#........#.
...#......##
Calculate the impact of the signal using this updated model. How many unique locations within the bounds of the map contain an antinode?

Your puzzle answer was 1184.
*/


import { execExamplePart1, execExamplePart2, execPart1, execPart2 } from "../helpers";
import { INPUT, SAMPLE_INPUT } from "./input/input-day8";

type Coordinate = {
    row: number;
    col: number;
}

type CoordPair = {
    c1: Coordinate,
    c2: Coordinate,
}

type GridDetails = {
    rows: number;
    cols: number;
}

type AntinodeMap = Record<string, Coordinate[]>;

function getCoordName(coord: Coordinate) {
    return `${coord.row}-${coord.col}`;
}

function isOnMap(coord: Coordinate, gridDetails: GridDetails) {
    return (coord.row >= 0 && coord.row < gridDetails.rows) && (coord.col >= 0 && coord.col < gridDetails.cols);
}

function sharedSetup(input: string = INPUT) {
    const lines = input.split('\n').filter(l => !!l);
    const frequencyPositions: AntinodeMap = {};
    for(let [rowIndex, row] of lines.entries()) {
        for (let [colIndex, cell] of row.split('').entries()) {
            if (cell !== '.') {
                frequencyPositions[cell] = [...(frequencyPositions[cell] ?? []), {row: rowIndex, col: colIndex}];
            }
        }
    }
    const gridDetails: GridDetails = {
        rows: lines.length,
        cols: lines[0].length,
    }
    return {frequencyPositions, gridDetails};
}

function findAntinodesForTwoCells({c1, c2}: CoordPair): Coordinate[] {
    const rowDiff = c2.row - c1.row;
    const colDiff = c2.col - c1.col;
    return [{row: c2.row + rowDiff, col: c2.col + colDiff}, {row: c1.row - rowDiff, col: c1.col - colDiff}];
}

function round(num: number) {
    return Math.round((num + Number.EPSILON) * 10000) / 10000;
}

function findAntinodesForTwoCellsPart2({c1, c2}: CoordPair, gridDetails: GridDetails): Coordinate[] {
    const yRowDiff = c2.row - c1.row;
    const xColDiff = c2.col - c1.col;
    const m = yRowDiff/xColDiff;
    const b = c1.row - (m * c1.col);
    const points: Coordinate[] = [];
    let newPoint: Coordinate = c1;
    for(let i = 0; i < gridDetails.cols; i++) {
        const x = i;
        const y = round((m * x) + b);
        newPoint = {row: y, col: x}
        if(y % 1 === 0 && isOnMap(newPoint, gridDetails)) {
            points.push(newPoint);
        }
    }
    return points;
}

function getAllPairs(coords: Coordinate[])
{
    const n = coords.length;
    const pairs: CoordPair[] = [];
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i !== j) {
                pairs.push({c1: coords[i], c2: coords[j]})
            }
        }
    }
    return pairs;
}

function findAntinodesForFrequency(coords: Coordinate[]) {
    const allPairs = getAllPairs(coords);
    return allPairs.map(findAntinodesForTwoCells).flat();
}

function findAntinodesForFrequencyPart2(coords: Coordinate[], gridDetails: GridDetails) {
    const allPairs = getAllPairs(coords);
    return allPairs.map(a => findAntinodesForTwoCellsPart2(a, gridDetails)).flat();
}

function findAllAntinodes(map: AntinodeMap, gridDetails: GridDetails) {
    const antinodes = Object.values(map).
        map(coords => findAntinodesForFrequency(coords))
        .flat()
        .filter(c => isOnMap(c, gridDetails));
    const set = new Set<string>(antinodes.map(getCoordName));
    return set.size;
}

function findAllAntinodesPart2(map: AntinodeMap, gridDetails: GridDetails) {
    const antinodes = Object.values(map)
        .map(coords => findAntinodesForFrequencyPart2(coords, gridDetails))
        .flat()
        .filter(c => isOnMap(c, gridDetails));
    const set = new Set<string>(antinodes.map(getCoordName));
    return set.size;
}

execExamplePart1(() => {
    const {frequencyPositions, gridDetails} = sharedSetup(SAMPLE_INPUT);
    return findAllAntinodes(frequencyPositions, gridDetails);
})

execExamplePart2(() => {
    const {frequencyPositions, gridDetails} = sharedSetup(SAMPLE_INPUT);
    return findAllAntinodesPart2(frequencyPositions, gridDetails);
})

execPart1(() => {
    const {frequencyPositions, gridDetails} = sharedSetup();
    return findAllAntinodes(frequencyPositions, gridDetails);
})

execPart2(() => {
    const {frequencyPositions, gridDetails} = sharedSetup();
    return findAllAntinodesPart2(frequencyPositions, gridDetails);
})

