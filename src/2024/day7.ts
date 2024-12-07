/*
--- Day 7: Bridge Repair ---
The Historians take you to a familiar rope bridge over a river in the middle of a jungle. The Chief isn't on this side of the bridge, though; maybe he's on the other side?

When you go to cross the bridge, you notice a group of engineers trying to repair it. (Apparently, it breaks pretty frequently.) You won't be able to cross until it's fixed.

You ask how long it'll take; the engineers tell you that it only needs final calibrations, but some young elephants were playing nearby and stole all the operators from their calibration equations! They could finish the calibrations if only someone could determine which test values could possibly be produced by placing any combination of operators into their calibration equations (your puzzle input).

For example:

190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
Each line represents a single equation. The test value appears before the colon on each line; it is your job to determine whether the remaining numbers can be combined with operators to produce the test value.

Operators are always evaluated left-to-right, not according to precedence rules. Furthermore, numbers in the equations cannot be rearranged. Glancing into the jungle, you can see elephants holding two different types of operators: add (+) and multiply (*).

Only three of the above equations can be made true by inserting operators:

190: 10 19 has only one position that accepts an operator: between 10 and 19. Choosing + would give 29, but choosing * would give the test value (10 * 19 = 190).
3267: 81 40 27 has two positions for operators. Of the four possible configurations of the operators, two cause the right side to match the test value: 81 + 40 * 27 and 81 * 40 + 27 both equal 3267 (when evaluated left-to-right)!
292: 11 6 16 20 can be solved in exactly one way: 11 + 6 * 16 + 20.
The engineers just need the total calibration result, which is the sum of the test values from just the equations that could possibly be true. In the above example, the sum of the test values for the three equations listed above is 3749.

Determine which equations could possibly be true. What is their total calibration result?

Your puzzle answer was 1260333054159.

--- Part Two ---
The engineers seem concerned; the total calibration result you gave them is nowhere close to being within safety tolerances. Just then, you spot your mistake: some well-hidden elephants are holding a third type of operator.

The concatenation operator (||) combines the digits from its left and right inputs into a single number. For example, 12 || 345 would become 12345. All operators are still evaluated left-to-right.

Now, apart from the three equations that could be made true using only addition and multiplication, the above example has three more equations that can be made true by inserting operators:

156: 15 6 can be made true through a single concatenation: 15 || 6 = 156.
7290: 6 8 6 15 can be made true using 6 * 8 || 6 * 15.
192: 17 8 14 can be made true using 17 || 8 + 14.
Adding up all six test values (the three that could be made before using only + and * plus the new three that can now be made by also using ||) produces the new total calibration result of 11387.

Using your new knowledge of elephant hiding spots, determine which equations could possibly be true. What is their total calibration result?

Your puzzle answer was 162042343638683.
*/


import { execExamplePart1, execExamplePart2, execPart1, execPart2, sum } from "../helpers";
import { INPUT, SAMPLE_INPUT } from "./input/input-day7";

class Equation {
    testValue: number;
    numbers: number[];

    constructor(public line: string, public withConcatenation: boolean) {
        const initialSplit = line.split(': ');
        this.testValue = +initialSplit[0];
        this.numbers = initialSplit[1].split(' ').map(i => +i);
    }

    isPossibleEquation(resultSoFar: number = 0, numbersRemaining: number[] = this.numbers): boolean {
        const currentNumber = numbersRemaining[0];
        const addResult = resultSoFar + currentNumber;
        const multResult = resultSoFar * currentNumber;
        const concatResult = +`${resultSoFar}${currentNumber}`;
        if (numbersRemaining.length === 1) {
            return addResult === this.testValue
                || multResult === this.testValue
                || (this.withConcatenation && concatResult === this.testValue);
        }
        const nextNumbers = numbersRemaining.slice(1);
        return this.isPossibleEquation(addResult, nextNumbers) || this.isPossibleEquation(multResult, nextNumbers) || (this.withConcatenation && this.isPossibleEquation(concatResult, nextNumbers));
    }
}

function sumPossibleEquations(equations: Equation[]) {
    return sum(equations.filter(e => e.isPossibleEquation()).map(e => e.testValue));
}

function sharedSetup(withConcatenation: boolean = false, input: string = INPUT) {
    const equations = input.split('\n').filter(l => !!l).map(l => new Equation(l, withConcatenation));
    return {equations};
}

execExamplePart1(() => {
    const {equations} = sharedSetup(false, SAMPLE_INPUT);
    return sumPossibleEquations(equations);
})

execExamplePart2(() => {
    const {equations} = sharedSetup(true, SAMPLE_INPUT);
    return sumPossibleEquations(equations);
})

execPart1(() => {
    const {equations} = sharedSetup();
    return sumPossibleEquations(equations);
})

execPart2(() => {
    const {equations} = sharedSetup(true);
    return sumPossibleEquations(equations);
})

