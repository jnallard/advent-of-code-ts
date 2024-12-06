import { INPUT, TEST_INPUT } from "./input/input-day8";

const createId = (x: number, y: number) => `${x}-${y}`;

class Tree {
    readonly id: string;
    constructor(public x: number, public y: number, public height: number) {
        this.id = createId(x, y);
    }

    getViewDistance(forest: Forest) {
        let distanceUp = this.getViewDistanceInDirection(forest, (x, y) => ({x, y: y + 1}));
        let distanceRight = this.getViewDistanceInDirection(forest, (x, y) => ({x: x + 1, y}));
        let distanceDown = this.getViewDistanceInDirection(forest, (x, y) => ({x, y: y - 1}));
        let distanceLeft = this.getViewDistanceInDirection(forest, (x, y) => ({x: x - 1, y}));
        return distanceUp * distanceRight * distanceDown * distanceLeft;
    }

    private getViewDistanceInDirection(forest: Forest, xyUpdater: (x: number, y: number) => {x: number, y: number}) {
        let cell = xyUpdater(this.x, this.y);
        let distance = 0;
        let nextTree = forest.trees.get(createId(cell.x, cell.y));
        while(!!nextTree) {
            distance++;
            if(nextTree.height >= this.height) {
                break;
            }
            cell = xyUpdater(cell.x, cell.y);
            nextTree = forest.trees.get(createId(cell.x, cell.y));
        }
        return distance;
    }
}

class Forest {
    rows: number;
    columns: number;
    trees = new Map<string, Tree>();

    constructor(lines: string[]) {
        this.rows = lines.length;
        this.columns = lines[0].length;
        for(let y = 0; y < this.rows; y++) {
            for(let x = 0; x < this.columns; x++) {
                const newTree = new Tree(x, y, +lines[y][x]);
                this.trees.set(newTree.id, newTree);
            }
        }
    }

    getVisibleTrees() {
        const treeIds = new Set<string>();
        for(let x = 0; x < this.rows; x++) {
            let highestSoFar = -1;
            for(let y = 0; y < this.columns; y++) {
                const currentTree = this.trees.get(createId(x, y)) as Tree;
                if (currentTree.height > highestSoFar) {
                    highestSoFar = currentTree.height;
                    treeIds.add(currentTree.id);
                }
            }
            highestSoFar = -1;
            for(let y = this.columns - 1; y >= 0; y--) {
                const currentTree = this.trees.get(createId(x, y)) as Tree;
                if (currentTree.height > highestSoFar) {
                    highestSoFar = currentTree.height;
                    treeIds.add(currentTree.id);
                }
            }
        }
        
        for(let y = 0; y < this.columns; y++) {
            let highestSoFar = -1;
            for(let x = 0; x < this.rows; x++) {
                const currentTree = this.trees.get(createId(x, y)) as Tree;
                if (currentTree.height > highestSoFar) {
                    highestSoFar = currentTree.height;
                    treeIds.add(currentTree.id);
                }
            }
            highestSoFar = -1;
            for(let x = this.rows - 1; x >= 0; x--) {
                const currentTree = this.trees.get(createId(x, y)) as Tree;
                if (currentTree.height > highestSoFar) {
                    highestSoFar = currentTree.height;
                    treeIds.add(currentTree.id);
                }
            }
        }
        return Array.from(treeIds);
    }
}

function day() {
    const lines =  INPUT.trim().split('\n');
    const forest = new Forest(lines);
    const visibleTrees = forest.getVisibleTrees();
    let part1Answer = visibleTrees.length;
    console.log('Part 1', part1Answer);

    let part2Answer = Math.max(...[...forest.trees.values()].map(tree => tree.getViewDistance(forest)));
    console.log('Part 2', part2Answer);
}
day();