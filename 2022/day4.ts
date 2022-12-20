import { isBetween } from "../helpers";
import { INPUT } from "./input/day4-input";

let fullyContainedPairs = 0;
let overlappedPairs = 0;

class Range {
    min: number;
    max: number;
    constructor(private input: string) {
        const parts = input.split('-');
        this.min = +parts[0];
        this.max = +parts[1];
    }

    containsRange(otherRange: Range) {
        return this.min <= otherRange.min && this.max >= otherRange.max;
    }

    overlapsRange(otherRange: Range) {
        return isBetween(this.min, otherRange.min, otherRange.max, true) || isBetween(this.max, otherRange.min, otherRange.max, true);
    }
}

class Pair {
    elfA: Range;
    elfB: Range;
    constructor(private input: string) {
        const parts = input.split(',');
        this.elfA = new Range(parts[0]);
        this.elfB =  new Range(parts[1]);
        if (this.elfA.containsRange(this.elfB) || this.elfB.containsRange(this.elfA)) {
            fullyContainedPairs++;
        }
        if (this.elfA.overlapsRange(this.elfB) || this.elfB.overlapsRange(this.elfA)) {
            overlappedPairs++;
        }
    }
}

function day() {
    const pairs = INPUT.trim().split('\n').map(s => new Pair(s));
    console.log('Part 1', fullyContainedPairs);
    console.log('Part 2', overlappedPairs);
}
day();