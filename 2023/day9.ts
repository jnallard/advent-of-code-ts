/*

*/


import { execPart1, execPart2, execExamplePart1, execExamplePart2, sum } from "../helpers";
import { EXAMPLE, INPUT } from "./input/input-day9";

class Reading {
    nextRow: Reading | undefined;
    constructor(public values: number[]) {
        if(values.some(v => v!== 0)) {
            this.nextRow = this.createNextRow();
        } 
    }

    createNextRow() {
        return new Reading(this.values.reduce((newArray, val, i) => {
            if(i < this.values.length - 1) {
                newArray.push(this.values[i + 1] - this.values[i]);
            }
            return newArray;
        }, [] as number[]));
    }

    predictNextValue(): number {
        return (this.nextRow?.predictNextValue() ?? 0) + this.values[this.values.length - 1];
    }

    predictPreviousValue(): number {
        return this.values[0] - (this.nextRow?.predictPreviousValue() ?? 0);
    }
}

execExamplePart1(() => {
    const readings = EXAMPLE.split('\n').filter(l => !!l).map(l => new Reading(l.trim().split(' ').map(v => +v)));
    const nextValues = readings.map(r => r.predictNextValue());
    return sum(nextValues);
})

execPart1(() => {
    const readings = INPUT.split('\n').filter(l => !!l).map(l => new Reading(l.trim().split(' ').map(v => +v)));
    const nextValues = readings.map(r => r.predictNextValue());
    return sum(nextValues);
})

execExamplePart2(() => {
    const readings = EXAMPLE.split('\n').filter(l => !!l).map(l => new Reading(l.trim().split(' ').map(v => +v)));
    const nextValues = readings.map(r => r.predictPreviousValue());
    return sum(nextValues);
})

execPart2(() => {
    const readings = INPUT.split('\n').filter(l => !!l).map(l => new Reading(l.trim().split(' ').map(v => +v)));
    const nextValues = readings.map(r => r.predictPreviousValue());
    return sum(nextValues);
})
