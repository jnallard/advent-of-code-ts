/*
--- Day 17: Chronospatial Computer ---
The Historians push the button on their strange device, but this time, you all just feel like you're falling.

"Situation critical", the device announces in a familiar voice. "Bootstrapping process failed. Initializing debugger...."

The small handheld device suddenly unfolds into an entire computer! The Historians look around nervously before one of them tosses it to you.

This seems to be a 3-bit computer: its program is a list of 3-bit numbers (0 through 7), like 0,1,2,3. The computer also has three registers named A, B, and C, but these registers aren't limited to 3 bits and can instead hold any integer.

The computer knows eight instructions, each identified by a 3-bit number (called the instruction's opcode). Each instruction also reads the 3-bit number after it as an input; this is called its operand.

A number called the instruction pointer identifies the position in the program from which the next opcode will be read; it starts at 0, pointing at the first 3-bit number in the program. Except for jump instructions, the instruction pointer increases by 2 after each instruction is processed (to move past the instruction's opcode and its operand). If the computer tries to read an opcode past the end of the program, it instead halts.

So, the program 0,1,2,3 would run the instruction whose opcode is 0 and pass it the operand 1, then run the instruction having opcode 2 and pass it the operand 3, then halt.

There are two types of operands; each instruction specifies the type of its operand. The value of a literal operand is the operand itself. For example, the value of the literal operand 7 is the number 7. The value of a combo operand can be found as follows:

Combo operands 0 through 3 represent literal values 0 through 3.
Combo operand 4 represents the value of register A.
Combo operand 5 represents the value of register B.
Combo operand 6 represents the value of register C.
Combo operand 7 is reserved and will not appear in valid programs.
The eight instructions are as follows:

The adv instruction (opcode 0) performs division. The numerator is the value in the A register. The denominator is found by raising 2 to the power of the instruction's combo operand. (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is truncated to an integer and then written to the A register.

The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.

The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits), then writes that value to the B register.

The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand; if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.

The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)

The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)

The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)

The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)

Here are some examples of instruction operation:

If register C contains 9, the program 2,6 would set register B to 1.
If register A contains 10, the program 5,0,5,1,5,4 would output 0,1,2.
If register A contains 2024, the program 0,1,5,4,3,0 would output 4,2,5,6,7,7,7,7,3,1,0 and leave 0 in register A.
If register B contains 29, the program 1,7 would set register B to 26.
If register B contains 2024 and register C contains 43690, the program 4,0 would set register B to 44354.
The Historians' strange device has finished initializing its debugger and is displaying some information about the program it is trying to run (your puzzle input). For example:

Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
Your first task is to determine what the program is trying to output. To do this, initialize the registers to the given values, then run the given program, collecting any output produced by out instructions. (Always join the values produced by out instructions with commas.) After the above program halts, its final output will be 4,6,3,5,6,3,5,2,1,0.

Using the information provided by the debugger, initialize the registers to the given values, then run the program. Once it halts, what do you get if you use commas to join the values it output into a single string?

Your puzzle answer was 7,5,4,3,4,5,3,4,6.

--- Part Two ---
Digging deeper in the device's manual, you discover the problem: this program is supposed to output another copy of the program! Unfortunately, the value in register A seems to have been corrupted. You'll need to find a new value to which you can initialize register A so that the program's output instructions produce an exact copy of the program itself.

For example:

Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
This program outputs a copy of itself if register A is instead initialized to 117440. (The original initial value of register A, 2024, is ignored.)

What is the lowest positive initial value for register A that causes the program to output a copy of itself?

Your puzzle answer was 164278899142333.
*/

import { bigIntMin, execExamplePart1, execPart1, execPart2 } from "../helpers";
import { INPUT, SAMPLE_INPUT_1 } from "./input/input-day17";

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

    constructor(private input: ComputerInput) {
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

class ComputerPart2 {
    program: bigint[];

    pointer = 0;

    output: bigint[] = [];

    constructor(private input: ComputerInput) {
        this.program = input.program.split(',').map(a => BigInt(+a));
    }

    /** See input file for though process for this */
    manualGetOutput(value: bigint) {
        return (((value % 8n) ^ 1n) ^ 5n) ^ (value >> ((value % 8n) ^ 1n)) % 8n;
    }

    /** See input file for though process for this */
    runManualInterpretation(a: bigint) {
        while (a !== BigInt(0)) {
            this.output.push(this.manualGetOutput(BigInt(a)));
            a = a >> BigInt(3);
        }
        return this.output.join(',');
    }

    // Inspiration: https://www.reddit.com/r/adventofcode/comments/1hg38ah/comment/m2gfl39/
    solve() {
        let inputs = new Set<bigint>([0n]);
        // start with the last bit in the code (represents the first 3 bits of the number)
        for (let num of this.program.reverse()) {
            let newInputs = new Set<bigint>();
            for (let currentNum of inputs) {
                for(let newSegment of Array(8).keys()) {
                    // for possible values so far, shift 3 bits to the left, then try 0-7 to see if those 3 new bits work
                    let newNum = (currentNum << 3n) + BigInt(newSegment);
                    if (this.manualGetOutput(newNum) === num) {
                        newInputs.add(newNum);
                    }
                }
            }
            inputs = newInputs;
        }
        const min = bigIntMin(...inputs);
        return min;
    }
}

function sharedSetup(input: string = INPUT) {
    const computerInput = input.match(INPUT_REGEX)!.groups as ComputerInput;
    const computer = new Computer(computerInput);
    const computer2 = new ComputerPart2(computerInput);
    return {computerInput, computer, computer2};
}

execExamplePart1(() => {
    const {computer} = sharedSetup(SAMPLE_INPUT_1);
    return computer.run();
})

execPart1(() => {
    const {computer} = sharedSetup();
    return computer.run();
}, 'original')

execPart1(() => {
    const {computer, computer2} = sharedSetup();
    return computer2.runManualInterpretation(BigInt(computer.regA));
}, 'simplified')

execPart2(() => {
    const {computer2} = sharedSetup();
    return computer2.solve();
})
