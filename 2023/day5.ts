/*

*/


import { execPart1, execPart2 } from "../helpers";
import {
    SEEDS,
    SEEDS_TO_SOIL,
    SOIL_TO_FERTILIZER,
    FERTILIZER_TO_WATER,
    WATER_TO_LIGHT,
    LIGHT_TO_TEMPERATURE,
    TEMP_TO_HUMIDIDY,
    HUMIDITY_TO_LOCATION
} from "./input/input-day5";

class Range {
    sourceRangeStart: number;
    targetRangeStart: number;
    length: number;
    sourceRangeEnd: number;
    targetRangeEnd: number;
    constructor(input: string) {
        const parsed = input.split(' ');
        this.targetRangeStart = +parsed[0];
        this.sourceRangeStart = +parsed[1];
        this.length = +parsed[2];
        this.sourceRangeEnd = this.sourceRangeStart + this.length;
        this.targetRangeEnd = this.targetRangeStart + this.length;
    }

    isInRange(value: number) {
        return this.sourceRangeStart <= value && value <= this.sourceRangeEnd;
    }

    transform(value: number) {
        const tranformedValue = (value - this.sourceRangeStart) + this.targetRangeStart;
        return tranformedValue;
    }
}

class Mapper {
    ranges: Range[];
    knownValues: Record<number, number> = {};
    constructor(rawInput: string, public nextMapper: Mapper | null) {
        const lines = rawInput.split('\n').filter(l => !!l);
        this.ranges = lines.map(l => new Range(l));
    } 

    map(value: number): number {
        if (this.knownValues[value]) {
            return this.knownValues[value];
        }
        const range = this.ranges.find(r => r.isInRange(value));
        const transformedValue = range ? range.transform(value) : value;
        const newValue = this.nextMapper ? this.nextMapper.map(transformedValue) : transformedValue;
        this.knownValues[value] = newValue;
        return newValue;
    }
}

const humidityToLocation = new Mapper(HUMIDITY_TO_LOCATION, null);
const tempToHumidity = new Mapper(TEMP_TO_HUMIDIDY, humidityToLocation);
const lightToTemp = new Mapper(LIGHT_TO_TEMPERATURE, tempToHumidity);
const waterToLight = new Mapper(WATER_TO_LIGHT, lightToTemp);
const fertToWater = new Mapper(FERTILIZER_TO_WATER, waterToLight);
const soilToFert = new Mapper(SOIL_TO_FERTILIZER, fertToWater);
const seedsToSoil = new Mapper(SEEDS_TO_SOIL, soilToFert);

const seedToLocation = (seed: number) => {
    return seedsToSoil.map(seed);
}

execPart1(() => {
    const seeds = SEEDS.split(' ').filter(l => !!l).map(x => +x);
    const locations = seeds.map(s => seedToLocation(s)).sort((a, b) => a - b);
    console.log(locations);
    return locations[0];
})

const part2SeedRegex = /(?<seedStart>\d+) (?<length>\d+)/g;

execPart2(() => {
    const seedConfigs = SEEDS.matchAll(part2SeedRegex);
    let minSoFar = Number.MAX_SAFE_INTEGER;
    for(let seedConfig of seedConfigs) {
        const seedStart = +(seedConfig?.groups?.['seedStart'] ?? '0');
        const seedLength = +(seedConfig?.groups?.['length'] ?? '0');
        for(let i = seedStart; i < seedStart + seedLength; i++) {
            const newValue = seedsToSoil.map(i);
            minSoFar = Math.min(newValue, minSoFar);
        }
        console.log(minSoFar);
    }
    return minSoFar;
})
