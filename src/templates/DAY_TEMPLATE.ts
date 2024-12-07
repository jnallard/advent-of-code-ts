/*

*/


import { execExamplePart1, execExamplePart2, execPart1, execPart2 } from "../helpers";
import { INPUT, SAMPLE_INPUT } from "./input/INPUT_TEMPLATE";

function sharedSetup(input: string = INPUT) {
    const lines = input.split('\n').filter(l => !!l);
    return {lines};
}

execExamplePart1(() => {
    const {lines} = sharedSetup(SAMPLE_INPUT);
    return 'TBD';
})

execExamplePart2(() => {
    const {lines} = sharedSetup(SAMPLE_INPUT);
    return 'TBD';
})

execPart1(() => {
    const {lines} = sharedSetup();
    return 'TBD';
})

execPart2(() => {
    const {lines} = sharedSetup();
    return 'TBD';
})
