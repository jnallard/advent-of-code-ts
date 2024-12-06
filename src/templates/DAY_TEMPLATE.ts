/*

*/


import { execPart1, execPart2 } from "../helpers";
import { INPUT } from "./input/INPUT_TEMPLATE";

function sharedSetup() {
    const lines = INPUT.split('\n').filter(l => !!l);
    return {lines};
}

execPart1(() => {
    const {lines} = sharedSetup();
    return 'TBD';
})

execPart2(() => {
    const {lines} = sharedSetup();
    return 'TBD';
})
