/*
--- Day 4: Ceres Search ---
"Looks like the Chief's not here. Next!" One of The Historians pulls out a device and pushes the only button on it. After a brief flash, you recognize the interior of the Ceres monitoring station!

As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt; she'd like to know if you could help her with her word search (your puzzle input). She only has to find one word: XMAS.

This word search allows words to be horizontal, vertical, diagonal, written backwards, or even overlapping other words. It's a little unusual, though, as you don't merely need to find one instance of XMAS - you need to find all of them. Here are a few ways XMAS might appear, where irrelevant characters have been replaced with .:


..X...
.SAMX.
.A..A.
XMAS.S
.X....
The actual word search will be full of letters instead. For example:

MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
In this word search, XMAS occurs a total of 18 times; here's the same word search again, but where letters not involved in any XMAS have been replaced with .:

....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX
Take a look at the little Elf's word search. How many times does XMAS appear?

Your puzzle answer was 2434.

--- Part Two ---
The Elf looks quizzically at you. Did you misunderstand the assignment?

Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle; it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

M.S
.A.
M.S
Irrelevant characters have again been replaced with . in the above diagram. Within the X, each MAS can be written forwards or backwards.

Here's the same example from before, but this time all of the X-MASes have been kept instead:

.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........
In this example, an X-MAS appears 9 times.

Flip the word search from the instructions back over to the word search side and try again. How many times does an X-MAS appear?

Your puzzle answer was 1835.
*/


import { execExamplePart1, execExamplePart2, execPart1, execPart2 } from "../helpers";
import { INPUT, SAMPLE_INPUT } from "./input/input-day4";

type Direction = {
    rowChange: number,
    colChange: number,
}
const NORTH: Direction = {rowChange: 1, colChange: 0};
const NORTH_EAST: Direction = {rowChange: 1, colChange: 1};
const EAST: Direction = {rowChange: 0, colChange: 1};
const SOUTH_EAST: Direction = {rowChange: -1, colChange: 1};
const SOUTH: Direction = {rowChange: -1, colChange: 0};
const SOUTH_WEST: Direction = {rowChange: -1, colChange: -1};
const WEST: Direction = {rowChange: 0, colChange: -1};
const NORTH_WEST: Direction = {rowChange: 1, colChange: -1};

function sharedSetup(input: string = INPUT) {
    const grid = input.split('\n').filter(l => !!l);
    const width = grid[0].length;
    const height = grid.length;
    return {grid, width, height};
}

function checkDirection({grid, row, col, direction: {rowChange, colChange}}: {grid: string[], row: number, col: number, direction: Direction}) {
    const hasXmas = grid[row]?.[col] === 'X' && 
        grid[row + rowChange]?.[col + colChange] === 'M' && 
        grid[row + rowChange * 2]?.[col + colChange * 2] === 'A' && 
        grid[row + rowChange * 3]?.[col + colChange * 3] === 'S';
    return hasXmas ? 1 : 0;
}

function checkForXMASesFromX(params: {grid: string[], row: number, col: number}) {
    return checkDirection({...params, direction: NORTH}) + 
        checkDirection({...params, direction: NORTH_EAST}) + 
        checkDirection({...params, direction: EAST}) + 
        checkDirection({...params, direction: SOUTH_EAST}) + 
        checkDirection({...params, direction: SOUTH}) + 
        checkDirection({...params, direction: SOUTH_WEST}) + 
        checkDirection({...params, direction: WEST}) + 
        checkDirection({...params, direction: NORTH_WEST})
}

function countXMASes({grid, width, height}: {grid: string[], width: number, height: number}) {
    let count = 0;
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (grid[row][col] === 'X') {
                count += checkForXMASesFromX({grid, row, col});
            }
        }
    }
    return count;
}

function getPosition({grid, row, col, direction: {rowChange, colChange}}: {grid: string[], row: number, col: number, direction: Direction}) {
    return grid[row + rowChange]?.[col + colChange] ?? ' ';
}

function getDiagonalCross(params: {grid: string[], row: number, col: number}) {
    return [
        getPosition({...params, direction: NORTH_EAST}),
        getPosition({...params, direction: SOUTH_EAST}),
        getPosition({...params, direction: SOUTH_WEST}),
        getPosition({...params, direction: NORTH_WEST}),
    ].join('')
}

function isMASCross(cross: string) {
    const sCount = (cross.match(/S/g) || []).length;
    const mCount = (cross.match(/M/g) || []).length;
    return sCount === 2 && mCount == 2 && (cross.includes('MM') || cross.includes('SS'));
}

function checkForMASCrossFromA(params: {grid: string[], row: number, col: number}) {
    const diagCross = getDiagonalCross(params);
    return isMASCross(diagCross) ? 1 : 0
}

function countMASCrosses({grid, width, height}: {grid: string[], width: number, height: number}) {
    let count = 0;
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (grid[row][col] === 'A') {
                count += checkForMASCrossFromA({grid, row, col});
            }
        }
    }
    return count;
}

execExamplePart1(() => {
    return countXMASes(sharedSetup(SAMPLE_INPUT));
})

execExamplePart2(() => {
    return countMASCrosses(sharedSetup(SAMPLE_INPUT));
})

execPart1(() => {
    return countXMASes(sharedSetup());
})

execPart2(() => {
    return countMASCrosses(sharedSetup());
})

