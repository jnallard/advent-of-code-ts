import { INPUT } from "./input/input-day6";

function getCharArray(signal: string, index: number, count: number) {
    return [...signal].slice(index - count, index);
}

function getDistinctCountIndex(signal: string, distinctCount: number) {
    for(let i = distinctCount - 1; i < signal.length; i++) {
        const charArray = getCharArray(signal, i, distinctCount);
        const set = new Set(charArray);
        if(set.size === distinctCount) {
            return i;
        }
    }
    return null;
}

function day() {
    const signal = INPUT.trim();
    let part1Answer = getDistinctCountIndex(signal, 4);
    console.log('Part 1', part1Answer);

    let part2Answer = getDistinctCountIndex(signal, 14);
    console.log('Part 2', part2Answer);
}
day();