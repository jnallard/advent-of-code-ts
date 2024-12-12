/*

*/


import { Coordinate, Grid } from "../grid-helpers";
import { execExamplePart1, execExamplePart2, execPart1, execPart2 } from "../helpers";
import { INPUT, SAMPLE_INPUT_1, SAMPLE_INPUT_2 } from "./input/input-day12";

type Region = number;
type RegionKey = string;

type RegionsLookup = Record<RegionKey, Region>;
type Regions = Record<Region, Coordinate[]>;

function getRegionKey(coord: Coordinate, crop: string) {
    return `${coord.row}-${coord.col}-${crop}`;
}

function fillRegion(coord: Coordinate, grid: Grid, region: Region, regions: Regions, regionLookup: RegionsLookup) {
    const regionKey = getRegionKey(coord, coord.value);
    if(regionLookup[regionKey] !== undefined) {
        return false;
    }
    if(regions[region] === undefined) {
        regions[region] = [];
    }
    regions[region].push(coord);
    regionLookup[regionKey] = region;
    for(let neighbor of grid.getNeighbors(coord, false, coord.value)) {
        fillRegion(neighbor, grid, region, regions, regionLookup);
    }
    return true;
}

function sharedSetup(input: string = INPUT) {
    const lines = input.split('\n').filter(l => !!l);
    const grid = new Grid(lines);
    const regions: Regions = {};
    let regionCount = 0;
    const regionsLookup: RegionsLookup = {};
    for(let coord of grid.coords) {
        const isNewRegion = fillRegion(coord, grid, regionCount, regions, regionsLookup);
        if(isNewRegion) {
            regionCount++;
        }
    }
    return {lines, grid, regions, regionsLookup};
}

execExamplePart1(() => {
    const {lines, grid, regions, regionsLookup} = sharedSetup(SAMPLE_INPUT_1);
    console.log(lines);
    console.log(grid);
    console.log(regions);
    console.log(regionsLookup);
    console.log(regions);
    console.log(Object.keys(regions).length);
    return 'TBD';
})

execExamplePart1(() => {
    const {lines, grid, regions, regionsLookup} = sharedSetup(SAMPLE_INPUT_2);
    console.log(lines);
    console.log(grid);
    console.log(regions);
    console.log(regionsLookup);
    console.log(Object.keys(regions).length);
    return 'TBD';
})

// execPart1(() => {
//     const {lines} = sharedSetup();
//     return 'TBD';
// })

// execPart2(() => {
//     const {lines} = sharedSetup();
//     return 'TBD';
// })

