import { INPUT, TEST_INPUT_1, TEST_INPUT_2 } from "./input/input-day9";

type Direction = "U" | "R" | "D" | "L";
const createId = (x: number, y: number) => `${x}-${y}`;

class CoordinateObject {
    public visited = new Set<string>();

    constructor(public name: string, public x: number, public y: number) {
        this.updateVisited();
    }

    private coordUpdater = {
        "U": () => this.y++,
        "R": () => this.x++,
        "D": () => this.y--,
        "L": () => this.x--,
    }

    moveDirection(direction: Direction) {
        this.coordUpdater[direction]();
        this.updateVisited();
    }

    follow(otherObject: CoordinateObject) {
        const xDistance = otherObject.x - this.x;
        const yDistance = otherObject.y - this.y
        const maxDistance = Math.max(Math.abs(xDistance), Math.abs(yDistance));
        if(maxDistance <= 1) {
            // Tail doesn't need to move
            return;
        }
        if(xDistance == 0) {
            this.y += yDistance > 0 ? 1 : -1;
        }
        else if(yDistance == 0) {
            this.x += xDistance > 0 ? 1 : -1;
        }
        else {
            this.y += yDistance > 0 ? 1 : -1;
            this.x += xDistance > 0 ? 1 : -1;
        }
        this.updateVisited();
    }

    private updateVisited() {
        this.visited.add(createId(this.x, this.y));
    }
}

class Rope {
    start = new CoordinateObject('start', 0, 0);
    head: CoordinateObject;
    knots: CoordinateObject[] = [];
    tail: CoordinateObject;
    constructor(knots: number) {
        for(let i = 0; i < knots; i++) {
            this.knots.push(new CoordinateObject(`Knot ${i}`, this.start.x, this.start.y));
        }
        this.head = this.knots[0];
        this.tail = this.knots[this.knots.length - 1];
    }

    performMove(input: string) {
        const parts = input.split(' ');
        const direction = parts[0] as "U" | "R" | "D" | "L";
        const distance = +parts[1];
        for(let i = 0; i < distance; i++) {
            this.head.moveDirection(direction);
            let lastKnot = this.head;
            for(let knot of this.knots.slice(1)) {
                knot.follow(lastKnot);
                lastKnot = knot;
            }
        }
    }
}

function day() {
    const moves = INPUT.trim().split('\n');
    const rope1 = new Rope(2);
    for(let move of moves) {
        rope1.performMove(move);
    }
    let part1Answer = rope1.tail.visited.size;
    console.log('Part 1', part1Answer);

    const rope2 = new Rope(10);
    for(let move of moves) {
        rope2.performMove(move);
    }
    let part2Answer = rope2.tail.visited.size;
    console.log('Part 2', part2Answer);
}
day();