import { intersect, sum } from "../helpers";
import { INPUT } from "./input/day3-input";


function getPriority(itemType: string) {
    const converted = itemType.toLowerCase();
    const isUpperCase = itemType !== converted;
    return converted.charCodeAt(0) - 96 + (isUpperCase ? 26 : 0);
}

class Rucksack {
    priorityOffset = 0;
    compA: any = {};
    compB: any = {};
    constructor(public input: string) {
        const aItems = input.substring(0, (input.length / 2));
        const bItems = input.substring(input.length / 2);
        for(let a of aItems) {
            this.compA[a] = true;
        }
        for(let b of bItems) {
            if(this.compA[b] && !this.compB[b]) {
                this.priorityOffset += getPriority(b);
            }
            this.compB[b] = true;
        }
    }

    getSet() {
        return new Set([...Object.keys(this.compA)].concat([...Object.keys(this.compB)]));
    }
} 

class ElfGroup {
    badgePriority = 0;
    constructor(
        private sack1: Rucksack,
        private sack2: Rucksack,
        private sack3: Rucksack,
    ) {
        //console.log(sack1.input, sack1.getSet(), sack2.getSet(), sack3.getSet());
        let badge = [...intersect(sack1.getSet(), sack2.getSet(), sack3.getSet())][0];
        this.badgePriority = getPriority(badge);
    }
}

function day() {
    const sacks = INPUT.trim().split('\n').map(s => new Rucksack(s));
    console.log('Part 1', sum(sacks.map(r => r.priorityOffset)));
    const groups: ElfGroup[] = [];
    for(let i = 0; i < sacks.length; i += 3) {
        groups.push(new ElfGroup(sacks[i], sacks[i + 1], sacks[i + 2]));
    }
    console.log('Part 2', sum(groups.map(r => r.badgePriority)));
}
day();