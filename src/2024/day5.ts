/*

*/


import { execExamplePart1, execExamplePart2, execPart1, execPart2, sum } from "../helpers";
import { EXAMPLE_PAGE_ORDERING_INPUT, EXAMPLE_PAGES_INPUT, PAGE_ORDERING_INPUT, PAGES_INPUT } from "./input/input-day5";

type PageOrder = {
    earlier: string,
    later: string,
}
type PageOrders = Record<string, PageOrder[]>

type Update = string[]

function sharedSetup(oageOrderingInput: string = PAGE_ORDERING_INPUT, pagesInput: string = PAGES_INPUT) {
    const pageOrderArray: PageOrder[] = oageOrderingInput.split('\n').filter(l => !!l).map(l => {
        const split = l.split('|');
        return {earlier: split[0], later: split[1]}
    });
    const pageOrders: PageOrders = {};
    for(let i = 0; i < pageOrderArray.length; i++) {
        const order = pageOrderArray[i];
        pageOrders[order.earlier] = (pageOrders[order.earlier] ? [...pageOrders[order.earlier], order] : [order])
    }
    const updates: Update[] = pagesInput.split('\n').filter(l => !!l).map(l => l.split(','));
    return {pageOrders, updates};
}

function validateUpdate(pageOrders: PageOrders, update: Update) {
    const seen: Record<string, boolean> = {};
    for(let currentPage of update) {
        const rules = pageOrders[currentPage] ?? [];
        for(let currentRule of rules) {
            if (seen[currentRule.later]) {
                return 0;
            }
        }

        seen[currentPage] = true;
    }
    return +update[(update.length - 1) / 2];
}

function validateUpdates(pageOrders: PageOrders, updates: Update[]) {
    return sum(updates.map(u => validateUpdate(pageOrders, u)));
}

execExamplePart1(() => {
    const {pageOrders, updates} = sharedSetup(EXAMPLE_PAGE_ORDERING_INPUT, EXAMPLE_PAGES_INPUT);
    return validateUpdates(pageOrders, updates);
})

execExamplePart2(() => {
    const {pageOrders, updates} = sharedSetup();
    return 'TBD';
})

execPart1(() => {
    const {pageOrders, updates} = sharedSetup();
    return validateUpdates(pageOrders, updates);
})

execPart2(() => {
    const {pageOrders, updates} = sharedSetup();
    return 'TBD';
})

