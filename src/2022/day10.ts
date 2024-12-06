import { isBetween, sum } from "../helpers";
import { INPUT, TEST_INPUT_1, TEST_INPUT_2 } from "./input/input-day10";

class Clock {
    registerValue = 1;
    cycle = 1;
    values: { [cycle: number]: number} = {};
    display: string[] = [];

    doPixelAndCycleMatch() {
        const pixelPosition = (this.cycle - 1) % 40;
        return isBetween(pixelPosition, this.registerValue - 1, this.registerValue + 1, true);
    }

    updateDisplay() {
        this.display[this.cycle - 1] = this.doPixelAndCycleMatch() ? '#' : ' ';
    }

    printDisplay() {
        const row1 = '  ' + this.display.slice(0, 40).join('');
        const row2 = '  ' + this.display.slice(40, 80).join('');
        const row3 = '  ' + this.display.slice(80, 120).join('');
        const row4 = '  ' + this.display.slice(120, 160).join('');
        const row5 = '  ' + this.display.slice(160, 200).join('');
        const row6 = '  ' + this.display.slice(200, 240).join('');
        console.log(row1);
        console.log(row2);
        console.log(row3);
        console.log(row4);
        console.log(row5);
        console.log(row6);
    }

    performInstuction(instruction: string) {
        if(instruction == 'noop') {
            this.values[this.cycle] = this.registerValue;
            this.updateDisplay();
            this.cycle++;
        } else {
            const changeAmount = +instruction.split(' ')[1];
            this.values[this.cycle] = this.registerValue;
            this.updateDisplay();
            this.cycle++;
            this.updateDisplay();
            this.values[this.cycle] = this.registerValue;
            this.cycle++;
            this.registerValue += changeAmount;
            this.values[this.cycle] = this.registerValue;
        }
    }

    getSignalStrength(targetCycle: number) {
        return targetCycle * this.values[targetCycle];
    }

    getSampledSignalStrengths() {
        return sum([
            this.getSignalStrength(20),
            this.getSignalStrength(60),
            this.getSignalStrength(100),
            this.getSignalStrength(140),
            this.getSignalStrength(180),
            this.getSignalStrength(220),
        ])
    }

}

function day() {
    const instructions = INPUT.trim().split('\n');
    const clock = new Clock();
    for(let instruction of instructions) {
        clock.performInstuction(instruction);
    }

    let part1Answer = clock.getSampledSignalStrengths();
    console.log('Part 1', part1Answer);

    let part2Answer = '(below)\n';
    console.log('Part 2', part2Answer);
    clock.printDisplay();
    console.log('\n');
}
day();