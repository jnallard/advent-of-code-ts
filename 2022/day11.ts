class Monkey {
    itemsInspected = 0;
    constructor(
        public id: number,
        public items: number[],
        public operation: (worryLevel: number) => number,
        public divisibleTest: number,
        public testPassMonkey: number,
        public testFailMonkey: number
    ) {

    }

    clone() {
        return new Monkey(this.id, this.items.slice(0), this.operation, this.divisibleTest, this.testPassMonkey, this.testFailMonkey);
    }

    acceptItem(item: number) {
        this.items.push(item);
    }

    performRound(allMonkeys: Monkey[], isLessStressful: boolean) {
        for(let item of this.items) {
            item = this.operation(item);
            if(isLessStressful) {
                item = Math.floor(item / 3);
            }
            let nextMonkeyId = item % this.divisibleTest == 0 ? this.testPassMonkey : this.testFailMonkey;
            allMonkeys[nextMonkeyId].acceptItem(item);
            this.itemsInspected++;
        }
        this.items = [];
    }
}


const Monkeys_Sample = [
    new Monkey(
        0,
        [79, 98],
        (worryLevel) => worryLevel * 19,
        23,
        2,
        3,
    ),
    new Monkey(
        1,
        [54, 65, 75, 74],
        (worryLevel) => worryLevel + 6,
        19,
        2,
        0,
    ),
    new Monkey(
        2,
        [79, 60, 97],
        (worryLevel) => worryLevel * worryLevel,
        13,
        1,
        3,
    ),
    new Monkey(
        3,
        [74],
        (worryLevel) => worryLevel + 3,
        17,
        0,
        1,
    ),
]

const Monkeys_Official = [
    new Monkey(
        0,
        [66, 59, 64, 51],
        (worryLevel) => worryLevel * 3,
        2,
        1,
        4,
    ),
    new Monkey(
        1,
        [67, 61],
        (worryLevel) => worryLevel * 19,
        7,
        3,
        5,
    ),
    new Monkey(
        2,
        [86, 93, 80, 70, 71, 81, 56],
        (worryLevel) => worryLevel + 2,
        11,
        4,
        0,
    ),
    new Monkey(
        3,
        [94],
        (worryLevel) => worryLevel * worryLevel,
        19,
        7,
        6,
    ),
    new Monkey(
        4,
        [71, 92, 64],
        (worryLevel) => worryLevel + 8,
        3,
        5,
        1,
    ),
    new Monkey(
        5,
        [58, 81, 92, 75, 56],
        (worryLevel) => worryLevel + 6,
        5,
        3,
        6,
    ),
    new Monkey(
        6,
        [82, 98, 77, 94, 86, 81],
        (worryLevel) => worryLevel + 7,
        17,
        7,
        2,
    ),
    new Monkey(
        7,
        [54, 95, 70, 93, 88, 93, 63, 50],
        (worryLevel) => worryLevel + 4,
        13,
        2,
        0,
    ),
]

function day() {
    const startingMonkeys = Monkeys_Sample;
    const monkeys_part1 = startingMonkeys.map(m => m.clone());
    for(let round = 0; round < 20; round++) {
        for(let currentMonkey of monkeys_part1) {
            currentMonkey.performRound(monkeys_part1, true);
        }
    }

    let topTwoMonkeyScores = monkeys_part1.map(m => m.itemsInspected).sort((a, b) => b - a).slice(0, 2);
    let part1Answer = topTwoMonkeyScores[0] * topTwoMonkeyScores[1];
    console.log('Part 1', part1Answer);

    const monkeys_part2 = startingMonkeys.map(m => m.clone());
    for(let round = 0; round < 10000; round++) {
        for(let currentMonkey of monkeys_part2) {
            currentMonkey.performRound(monkeys_part2, false);
        }
    }
    console.log(monkeys_part2);

    let topTwoMonkeyScoresPart2 = monkeys_part2.map(m => m.itemsInspected).sort((a, b) => b - a).slice(0, 2);
    let part2Answer = topTwoMonkeyScoresPart2[0] * topTwoMonkeyScoresPart2[1];
    console.log('Part 2', part2Answer);
}
day();