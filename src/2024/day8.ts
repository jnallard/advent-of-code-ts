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


import { Coordinate, CoordinatePair, getAllPairs, Grid } from "../grid-helpers";
import { execExamplePart1, execExamplePart2, execPart1, execPart2, round } from "../helpers";
import { INPUT, SAMPLE_INPUT } from "./input/input-day8";

type AntinodeMap = Record<string, Coordinate[]>;

function sharedSetup(input: string = INPUT) {
    const grid = new Grid(input.split('\n').filter(l => !!l));
    const frequencyPositions: AntinodeMap = {};
    for(let coord of grid.coords) {
        if (coord.value !== '.') {
            frequencyPositions[coord.value] = [...(frequencyPositions[coord.value] ?? []), coord];
        }
    }
    return {frequencyPositions, grid};
}

function findAntinodesForTwoCells({c1, c2}: CoordinatePair, grid: Grid): Coordinate[] {
    const rowDiff = c2.row - c1.row;
    const colDiff = c2.col - c1.col;
    return [grid.getCoord(c2.row + rowDiff, c2.col + colDiff), grid.getCoord(c1.row - rowDiff, c1.col - colDiff)];
}

function findAntinodesForTwoCellsPart2({c1, c2}: CoordinatePair, grid: Grid): Coordinate[] {
    const yRowDiff = c2.row - c1.row;
    const xColDiff = c2.col - c1.col;
    const m = yRowDiff/xColDiff;
    const b = c1.row - (m * c1.col);
    const points: Coordinate[] = [];
    let newPoint: Coordinate = c1;
    for(let i = 0; i < grid.colCount; i++) {
        const x = i;
        const y = round((m * x) + b);
        newPoint = grid.getCoord(y, x);
        if(y % 1 === 0 && !!newPoint) {
            points.push(newPoint);
        }
    }
    return points;
}

function findAntinodesForFrequency(coords: Coordinate[], grid: Grid) {
    const allPairs = getAllPairs(coords);
    return allPairs.map(pair => findAntinodesForTwoCells(pair, grid)).flat();
}

function findAntinodesForFrequencyPart2(coords: Coordinate[], grid: Grid) {
    const allPairs = getAllPairs(coords);
    return allPairs.map(a => findAntinodesForTwoCellsPart2(a, grid)).flat();
}

function findAllAntinodes(map: AntinodeMap, grid: Grid) {
    const antinodes = Object.values(map).
        map(coords => findAntinodesForFrequency(coords, grid))
        .flat()
        .filter(c => grid.isOnMap(c));
    const set = new Set<string>(antinodes.map(a => a.id));
    return set.size;
}

function findAllAntinodesPart2(map: AntinodeMap, grid: Grid) {
    const antinodes = Object.values(map)
        .map(coords => findAntinodesForFrequencyPart2(coords, grid))
        .flat()
        .filter(c => grid.isOnMap(c));
    const set = new Set<string>(antinodes.map(a => a.id));
    return set.size;
}

execExamplePart1(() => {
    const {frequencyPositions, grid} = sharedSetup(SAMPLE_INPUT);
    return findAllAntinodes(frequencyPositions, grid);
})

execExamplePart2(() => {
    const {frequencyPositions, grid} = sharedSetup(SAMPLE_INPUT);
    return findAllAntinodesPart2(frequencyPositions, grid);
})

execPart1(() => {
    const {frequencyPositions, grid} = sharedSetup();
    return findAllAntinodes(frequencyPositions, grid);
})

execPart2(() => {
    const {frequencyPositions, grid} = sharedSetup();
    return findAllAntinodesPart2(frequencyPositions, grid);
})

