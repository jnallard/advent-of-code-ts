/*
--- Day 13: Claw Contraption ---
Next up: the lobby of a resort on a tropical island. The Historians take a moment to admire the hexagonal floor tiles before spreading out.

Fortunately, it looks like the resort has a new arcade! Maybe you can win some prizes from the claw machines?

The claw machines here are a little unusual. Instead of a joystick or directional buttons to control the claw, these machines have two buttons labeled A and B. Worse, you can't just put in a token and play; it costs 3 tokens to push the A button and 1 token to push the B button.

With a little experimentation, you figure out that each machine's buttons are configured to move the claw a specific amount to the right (along the X axis) and a specific amount forward (along the Y axis) each time that button is pressed.

Each machine contains one prize; to win the prize, the claw must be positioned exactly above the prize on both the X and Y axes.

You wonder: what is the smallest number of tokens you would have to spend to win as many prizes as possible? You assemble a list of every machine's button behavior and prize location (your puzzle input). For example:

Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
This list describes the button configuration and prize location of four different claw machines.

For now, consider just the first claw machine in the list:

Pushing the machine's A button would move the claw 94 units along the X axis and 34 units along the Y axis.
Pushing the B button would move the claw 22 units along the X axis and 67 units along the Y axis.
The prize is located at X=8400, Y=5400; this means that from the claw's initial position, it would need to move exactly 8400 units along the X axis and exactly 5400 units along the Y axis to be perfectly aligned with the prize in this machine.
The cheapest way to win the prize is by pushing the A button 80 times and the B button 40 times. This would line up the claw along the X axis (because 80*94 + 40*22 = 8400) and along the Y axis (because 80*34 + 40*67 = 5400). Doing this would cost 80*3 tokens for the A presses and 40*1 for the B presses, a total of 280 tokens.

For the second and fourth claw machines, there is no combination of A and B presses that will ever win a prize.

For the third claw machine, the cheapest way to win the prize is by pushing the A button 38 times and the B button 86 times. Doing this would cost a total of 200 tokens.

So, the most prizes you could possibly win is two; the minimum tokens you would have to spend to win all (two) prizes is 480.

You estimate that each button would need to be pressed no more than 100 times to win a prize. How else would someone be expected to play?

Figure out how to win as many prizes as possible. What is the fewest tokens you would have to spend to win all possible prizes?

Your puzzle answer was 25629.

--- Part Two ---
As you go to win the first prize, you discover that the claw is nowhere near where you expected it would be. Due to a unit conversion error in your measurements, the position of every prize is actually 10000000000000 higher on both the X and Y axis!

Add 10000000000000 to the X and Y position of every prize. After making this change, the example above would now look like this:

Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=10000000008400, Y=10000000005400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=10000000012748, Y=10000000012176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=10000000007870, Y=10000000006450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=10000000018641, Y=10000000010279
Now, it is only possible to win a prize on the second and fourth claw machines. Unfortunately, it will take many more than 100 presses to do so.

Using the corrected prize coordinates, figure out how to win as many prizes as possible. What is the fewest tokens you would have to spend to win all possible prizes?

Your puzzle answer was 107487112929999.
*/


import Decimal from "decimal.js";
import { bignumber, lusolve, matrix } from "mathjs";
import { execPart1, execPart2, sum } from "../helpers";
import { INPUT } from "./input/input-day13";

Decimal.set({ precision: 100 })

type GameInput = {
    xA: string;
    yA: string;
    xB: string;
    yB: string;
    prizeX: string;
    prizeY: string;
}

type Game = {
    xA: number;
    yA: number;
    xB: number;
    yB: number;
    prizeX: number;
    prizeY: number;
}

const costA = 3;
const costB = 1;

const FULL_REGEX = /Button A: X\+(?<xA>\d+), Y\+(?<yA>\d+)\nButton B: X\+(?<xB>\d+), Y\+(?<yB>\d+)\nPrize: X=(?<prizeX>\d+), Y=(?<prizeY>\d+)/gm

function sharedSetup(input: string = INPUT) {
    const games: Game[] = [...input.matchAll(FULL_REGEX)].map(a => a.groups as GameInput).map(ri => ({xA: +ri.xA, yA: +ri.yA, xB: +ri.xB, yB: +ri.yB, prizeX: +ri.prizeX, prizeY: +ri.prizeY}));
    return {games};
}

function mutateGame(game: Game) {
    game.prizeX += 10000000000000;
    game.prizeY += 10000000000000;
}

/**
 * I figured out on my own that I could consider X and Y as two different lines and see where they intersect. I used this stack overflow to figure out how to find where they intersect.
 * https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
 * But had to convert to Decimal for increased precision
 */
function lineIntersect(a1: Decimal, b1: Decimal, a2: Decimal, b2: Decimal, a3: Decimal, b3: Decimal, a4: Decimal, b4: Decimal)
{
    const diff1 = b4.minus(b3);
    const diff2 = a2.minus(a1);
    const diff3 = a4.minus(a3);
    const diff4 = b2.minus(b1);

    let denom = (diff1.times(diff2)).minus(diff3.times(diff4));
    if (denom.toNumber() == 0) {
        return null;
    }
    let ua = (a4.minus(a3)).times(b1.minus(b3)).minus((b4.minus(b3)).times(a1.minus(a3))).div(denom);
    return {
        a: (a1.plus(ua.times(a2.minus(a1)))),
        b: (b1.plus(ua.times(b2.minus(b1)))),
    };
}

function computeGameWithHighPrecision(game: Game) {
    // 8400 = 94a + 22b
    // prizeX = xA * a + xB * b
    // b = (prizeX - xA * a)/xb

    const bX0 = Decimal.div(game.prizeX, game.xB);
    const bX1 = Decimal.div(game.prizeX - game.xA, game.xB);

    const bY0 = Decimal.div(game.prizeY, game.yB);
    const bY1 = Decimal.div(game.prizeY - game.yA, game.yB);

    const intersection = lineIntersect(new Decimal(0), bX0, new Decimal(1), bX1, new Decimal(0), bY0, new Decimal(1), bY1);
    if (intersection === null) {
        throw 'this should not happen';
    }
    if (intersection.a.toNumber() % 1 === 0 && intersection.b.toNumber() % 1 === 0) {
        return costA * intersection.a.toNumber() + costB * intersection.b.toNumber();
    }
    return undefined;
}

/**
 * I was reminded after that I could use Matrix math for a simpler code answer
 */
function computeGameWithMatrix(game: Game) {
    // const matrix = matrix([[game.xA, game.xB, game.prizeX], [game.yA, game.yB, game.prizeY]]);
    const c = matrix([[bignumber(game.xA), bignumber(game.xB)], [bignumber(game.yA), bignumber(game.yB)]]);
    const d = matrix([bignumber(game.prizeX), bignumber(game.prizeY)]);
    const solvedMatrix = lusolve(c, d);
    const a = solvedMatrix.get([0, 0]);
    const b = solvedMatrix.get([1, 0]);
    if (a % 1 === 0 && b % 1 === 0) {
        return costA * a + costB * b;
    }
    return undefined;
}

execPart1(() => {
    const {games} = sharedSetup();
    const results = games.map(g => computeGameWithHighPrecision(g)).filter(n => n !== undefined);
    return sum(results);
}, 'Manual')

execPart1(() => {
    const {games} = sharedSetup();
    const results = games.map(g => computeGameWithMatrix(g)).filter(n => n !== undefined);
    return sum(results);
}, 'MathJS')

execPart2(() => {
    const {games} = sharedSetup();
    games.forEach(mutateGame);
    const results = games.map(g => computeGameWithHighPrecision(g)).filter(n => n !== undefined);
    return sum(results);
}, 'Manual')

execPart2(() => {
    const {games} = sharedSetup();
    games.forEach(mutateGame);
    const results = games.map(g => computeGameWithMatrix(g)).filter(n => n !== undefined);
    return sum(results);
}, 'MathJS')

