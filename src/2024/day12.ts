/*

*/


import { Coordinate, Grid } from "../grid-helpers";
import { execExamplePart1, execExamplePart2, execPart1, execPart2, sum } from "../helpers";
import { INPUT, SAMPLE_INPUT_1, SAMPLE_INPUT_2 } from "./input/input-day12";

type RegionNbr = number;
type RegionKey = string;

type RegionsLookup = Record<RegionKey, RegionNbr>;
type Regions = Record<RegionNbr, Coordinate[]>;

function getRegionKey(coord: Coordinate, crop: string) {
    return `${coord.row}-${coord.col}-${crop}`;
}

function fillRegion(coord: Coordinate, grid: Grid, region: RegionNbr, regions: Regions, regionLookup: RegionsLookup) {
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

function countFencesPerCell(coord: Coordinate, grid: Grid, regionNbr: RegionNbr, regionLookup: RegionsLookup) {
    return grid.getNeighbors(coord, false, undefined, true).filter(neighbor => regionLookup[getRegionKey(neighbor, coord.value)] !== regionNbr).length;
}

function countFencesPerRegion(regionNbr: RegionNbr, grid: Grid, regions: Regions, regionLookup: RegionsLookup) {
    const region = regions[regionNbr];
    const fences = sum(region.map(coord => countFencesPerCell(coord, grid, regionNbr, regionLookup)));
    const area = region.length;
    const crop = region[0].value;
    // console.log({crop, regionNbr, fences, area});
    return fences * area;
}

function countFences(grid: Grid, regions: Regions, regionLookup: RegionsLookup) {
    return sum(Object.keys(regions).map(regionNbr => countFencesPerRegion(+regionNbr, grid, regions, regionLookup)));
}

function countSidesPerRegion(regionNbr: RegionNbr, grid: Grid, regions: Regions, regionLookup: RegionsLookup) {
    const region = regions[regionNbr];
    const sideCoords = region.filter(coord => countFencesPerCell(coord, grid, regionNbr, regionLookup) > 0);
    console.log(sideCoords);
    const area = region.length;
    const crop = region[0].value;
    // console.log({crop, regionNbr, fences, area});
    return area;
}

function countFencesBySide(grid: Grid, regions: Regions, regionLookup: RegionsLookup) {
    return sum(Object.keys(regions).map(regionNbr => countSidesPerRegion(+regionNbr, grid, regions, regionLookup)));
}

execExamplePart1(() => {
    const {lines, grid, regions, regionsLookup} = sharedSetup(SAMPLE_INPUT_1);
    // console.log(lines);
    // console.log(grid);
    // console.log(regions);
    // console.log(regionsLookup);
    // console.log(regions);
    // console.log(Object.keys(regions).length);
    return countFences(grid, regions, regionsLookup);
})

execExamplePart1(() => {
    const {lines, grid, regions, regionsLookup} = sharedSetup(SAMPLE_INPUT_2);
    // console.log(lines);
    // console.log(grid);
    // console.log(regions);
    // console.log(regionsLookup);
    // console.log(Object.keys(regions).length);
    return countFences(grid, regions, regionsLookup);
})

execPart1(() => {
    const {lines, grid, regions, regionsLookup} = sharedSetup();
    // console.log(lines);
    // console.log(grid);
    // console.log(regions);
    // console.log(regionsLookup);
    // console.log(Object.keys(regions).length);
    return countFences(grid, regions, regionsLookup);
})

execExamplePart2(() => {
    const {lines, grid, regions, regionsLookup} = sharedSetup(SAMPLE_INPUT_1);
    // console.log(lines);
    // console.log(grid);
    // console.log(regions);
    // console.log(regionsLookup);
    // console.log(Object.keys(regions).length);
    return countFencesBySide(grid, regions, regionsLookup);
})

execExamplePart2(() => {
    const {lines, grid, regions, regionsLookup} = sharedSetup(SAMPLE_INPUT_2);
    // console.log(lines);
    // console.log(grid);
    // console.log(regions);
    // console.log(regionsLookup);
    // console.log(Object.keys(regions).length);
    return countFencesBySide(grid, regions, regionsLookup);
})

// execPart2(() => {
//     const {lines} = sharedSetup();
//     return 'TBD';
// })

