import { isBetween } from "../helpers";
import { INPUT_STACKS, INPUT_MOVES } from "./input/day5-input";

class ShippingYard {
    private stacks: Stack[] = [];
    constructor(private input: string) {
        const rows = input.split('\n');
        const stackCount = (rows[0].length + 1) / 4;
        for(let stackId = 1; stackId < stackCount + 1; stackId++) {
            this.stacks.push(new Stack(stackId));
        }
        for(let row of rows.slice(0, rows.length - 1)) {
            for(let i = 0; i < stackCount; i++) {
                const value = row[1 + (i * 4)];
                if(value.trim()) {
                    this.stacks[i].crates.unshift(value);
                }
            }
        }
    }

    executeMovePart1(move: Move) {
        const sourceStack = this.stacks[move.stackSource - 1];
        const targetStack = this.stacks[move.stackTarget - 1];
        for(let i = 0; i < move.crateCount; i++) {
            let crate = sourceStack.crates.pop() ?? '';
            targetStack.crates.push(crate);
        }
    }

    executeMovePart2(move: Move) {
        const sourceStack = this.stacks[move.stackSource - 1];
        const targetStack = this.stacks[move.stackTarget - 1];
        const cratesToMove = sourceStack.crates.splice(sourceStack.crates.length - move.crateCount);
        targetStack.crates = targetStack.crates.concat(cratesToMove);
    }

    getTopCrates() {
        return this.stacks.map(s => s.getTopCrate()).join('');
    }
}

class Stack {
    crates: string[] = [];
    constructor(private stackId: number) {
        
    }

    getTopCrate() {
        return this.crates[this.crates.length - 1];
    }
}

class Move {
    crateCount: number;
    stackSource: number;
    stackTarget: number;
    constructor(private input: string) {
        const numbers =  input.match(/\d+/g) ?? [-1, -1, -1];
        this.crateCount = +numbers[0];
        this.stackSource = +numbers[1];
        this.stackTarget = +numbers[2];
    }
}

function day() {
    const shipyard_part_1 = new ShippingYard(INPUT_STACKS.substring(1, INPUT_STACKS.length - 1));
    const moves = INPUT_MOVES.trim().split('\n').map(s => new Move(s));
    for(let move of moves) {
        shipyard_part_1.executeMovePart1(move);
    }
    console.log('Part 1', shipyard_part_1.getTopCrates());

    
    const shipyard_part_2 = new ShippingYard(INPUT_STACKS.substring(1, INPUT_STACKS.length - 1));
    for(let move of moves) {
        shipyard_part_2.executeMovePart2(move);
    }
    console.log('Part 2', shipyard_part_2.getTopCrates());
}
day();