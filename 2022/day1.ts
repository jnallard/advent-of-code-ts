import { sum } from "../helpers";
import { INPUT } from "./input/input-day1";

class Elf {
    static topElf: Elf;
    calories: number = 0;
    constructor(public input: string, public elfNumber: number) {
        this.calories = sum(input.split('\n').map(cal => +cal));
        if(!Elf.topElf || this.calories > Elf.topElf.calories) {
            Elf.topElf = this;
        }
    }
}

function day() {
    const elves = INPUT.split('\n\n').map((s, i) => new Elf(s, i));
    console.log('part 1: ', Elf.topElf.calories);
    elves.sort((a, b) => a.calories - b.calories);
    const topElves = elves.slice(elves.length - 3);
    console.log('part 2: ', sum(topElves.map(e => e.calories)));
}
day();