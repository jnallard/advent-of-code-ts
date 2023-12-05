/*
--- Day 3: Gear Ratios ---
You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?

Your puzzle answer was 532331.

--- Part Two ---
The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?

Your puzzle answer was 82301120.
*/


import { execPart1, execPart2, sum } from "../helpers";
import { INPUT } from "./input/input-day3";

const NumberRegex = /\d+/g;

class Schematic {
    numRows: number;
    numCols: number;
    productNumbers: number[] = [];
    asteriskLocations: Record<string, number[]> = {};
    constructor(public inputLines: string[]) {
        this.numRows = inputLines.length;
        this.numCols = inputLines[0]?.length ?? 0;
        for (let rowIndex = 0; rowIndex < inputLines.length; rowIndex ++) {
            const line = inputLines[rowIndex];
            const matches = line.matchAll(NumberRegex);
            for (let match of matches) {
                const matchValue = match[0];
                if(this.isProductNumber(matchValue, rowIndex, match.index ?? 0)) {
                    this.productNumbers.push(+matchValue);
                }
            }
        }
    }

    isProductNumber(numberString: string, rowIndex: number, columnIndex: number) {
        const firstRow = Math.max(rowIndex - 1, 0);
        const lastRow = Math.min(rowIndex + 1, this.numRows - 1);
        const firstCol = Math.max(columnIndex - 1, 0);
        const lastCol = Math.min(columnIndex + numberString.length, this.numCols - 1);
        let isProductNumber = false;
        for(let i = firstRow; i <= lastRow; i++) {
            for(let j = firstCol; j <= lastCol; j++) {
                const adjacentDetails = this.getAdjacentCharDetails(i, j);
                if(adjacentDetails.isSpecial) {
                    isProductNumber = true;
                }
                if(adjacentDetails.isAsterisk) {
                    const asteriskKey = `${i}-${j}`;
                    if (!this.asteriskLocations[asteriskKey]) {
                        this.asteriskLocations[asteriskKey] = [];
                    }
                    this.asteriskLocations[asteriskKey].push(+numberString);
                }
            }
        }
        return isProductNumber;
    }

    getAdjacentCharDetails(rowIndex: number, columnIndex: number) {
        const char = this.inputLines[rowIndex][columnIndex];
        const charCode = char.charCodeAt(0);
        const isAsterisk = charCode === 42;
        const isSpecial = charCode !== 46 && (charCode < 48 || charCode > 57);
        return {isSpecial, isAsterisk};
    }

    getGearRatios() {
        return Object.values(this.asteriskLocations).filter(numbers => numbers.length === 2).map(numbers => numbers[0] * numbers[1]);
    }
}

execPart1(() => {
    const lines = INPUT.split('\n').filter(l => !!l);
    const schematic = new Schematic(lines);
    return sum(schematic.productNumbers);
})

execPart2(() => {
    const lines = INPUT.split('\n').filter(l => !!l);
    const schematic = new Schematic(lines);
    return sum(schematic.getGearRatios());
})
