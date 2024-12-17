/*

*/


import { execExamplePart1, execExamplePart2, execPart1, execPart2 } from "../helpers";
import { INPUT, SAMPLE_INPUT_1, SAMPLE_INPUT_2 } from "./input/input-day17";

const INPUT_REGEX = /Register A: (?<regA>\d+)\nRegister B: (?<regB>\d+)\nRegister C: (?<regC>\d+)\n\nProgram: (?<program>[\d,]+)/;

type ComputerInput = {
    regA: string,
    regB: string,
    regC: string,
    program: string,
}

class Computer {
    regA: number;
    regB: number;
    regC: number;
    program: number[];

    pointer = 0;

    output: number[] = [];

    constructor(input: ComputerInput) {
        this.regA = +input.regA;
        this.regB = +input.regB;
        this.regC = +input.regC;
        this.program = input.program.split(',').map(a => +a);
    }

    getComboOperand(combo_operand: number) {
        switch (combo_operand){
            case 0:
            case 1:
            case 2:
            case 3:
                return combo_operand;
            case 4:
                return this.regA;
            case 5:
                return this.regB;
            case 6:
                return this.regC;
            default:
                throw 'unsupported combo operand'
        }
    }

    op_adv(combo_operand: number) {
        const value = this.getComboOperand(combo_operand);
        this.regA = Math.floor(this.regA/Math.pow(2, value));
        return true;
    }

    op_bxl(literal_operand: number) {
        this.regB = this.regB ^ literal_operand;
        return true;
    }

    op_bst(combo_operand: number) {
        const value = this.getComboOperand(combo_operand);
        this.regB = value % 8;
        return true;
    }

    op_jnz(literal_operand: number) {
        if(this.regA === 0) {
            return true;
        }
        this.pointer = literal_operand;
        return false;
    }

    op_bxc(ignored_operand: number) {
        this.regB = this.regB ^ this.regC;
        return true;
    }

    op_out(combo_operand: number) {
        const value = this.getComboOperand(combo_operand);
        this.output.push(value % 8);
        return true;
    }

    op_bdv(combo_operand: number) {
        const value = this.getComboOperand(combo_operand);
        this.regB = Math.floor(this.regA/Math.pow(2, value));
        return true;
    }

    op_cdv(combo_operand: number) {
        const value = this.getComboOperand(combo_operand);
        this.regC = Math.floor(this.regA/Math.pow(2, value));
        return true;
    }

    ops: Record<number, (operand: number) => boolean> = {
        0: (o) => this.op_adv(o),
        1: (o) => this.op_bxl(o),
        2: (o) => this.op_bst(o),
        3: (o) => this.op_jnz(o),
        4: (o) => this.op_bxc(o),
        5: (o) => this.op_out(o),
        6: (o) => this.op_bdv(o),
        7: (o) => this.op_cdv(o),
    }

    run() {
        let c = 0;
        while(this.pointer < this.program.length) {
            c++;
            const instruction = this.program[this.pointer];
            const operand = this.program[this.pointer + 1];
            if(this.ops[instruction](operand)) {
                this.pointer = this.pointer + 2;
            }
        }
        return this.output.join(',');
    }
}

function sharedSetup(input: string = INPUT) {
    const computerInput = input.match(INPUT_REGEX)!.groups as ComputerInput;
    const computer = new Computer(computerInput);
    return {computerInput, computer};
}

function findMatchingProgram(computerInput: ComputerInput) {
    let i = 0;
    while(true) {
        if(i % 1000 === 0) {
            console.log(i);
        }
        let computer = new Computer(computerInput);
        computer.regA = i;
        let result = computer.run();
        if(result === computerInput.program) {
            return i;
        }
        i++;
    }
}

// execExamplePart1(() => {
//     const {computer} = sharedSetup(SAMPLE_INPUT_1);
//     console.log(computer);
//     return computer.run();
// })

execExamplePart2(() => {
    const {computerInput} = sharedSetup(SAMPLE_INPUT_2);
    return findMatchingProgram(computerInput);
})

// execPart1(() => {
//     const {computer} = sharedSetup();
//     console.log(computer);
//     return computer.run();
// })

execPart2(() => {
    const {computerInput} = sharedSetup();
    return findMatchingProgram(computerInput);
})

