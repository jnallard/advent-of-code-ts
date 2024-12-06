import { sum } from "../helpers";
import { INPUT } from "./input/input-day2";

abstract class BaseRound {
    inputA: string;
    inputB: string;
    theirShape: string;
    ourShape: string;
    score: number;

    constructor(private input: string) {
        const shapes = input.split(' ');
        this.inputA = shapes[0];
        this.inputB = shapes[1];
        this.theirShape = this.convertShape(this.inputA);
        this.ourShape = this.getOurShape();
        this.score = this.getShapeScore(this.ourShape) + this.getMatchScore();
    }

    convertShape(shape: string) {
        switch(shape) {
            case 'A':
            case 'X':
                return 'R';
            case 'B':
            case 'Y':
                return 'P';
            case 'C': 
            case 'Z':
                return 'S';
        }
        return '';
    }

    getShapeScore(shape: string) {
        switch(shape) {
            case 'R':
                return 1;
            case 'P':
                return 2;
            case 'S': 
                return 3;
        }
        return 0;
    }

    getMatchScore() {
        const match = `${this.theirShape}-${this.ourShape}`;
        switch(match) {
            case 'R-S':
            case 'P-R':
            case 'S-P':
                return 0;
            case 'R-R':
            case 'P-P':
            case 'S-S':
                return 3;
            case 'S-R':
            case 'R-P':
            case 'P-S':
                return 6;
        }
        return 0;
    }

    abstract getOurShape(): string;
}

class Part1Round extends BaseRound {
    getOurShape(): string {
        return this.convertShape(this.inputB);
    }
}

class Part2Round extends BaseRound {
    getOurShape() {
        if(this.inputB === 'X') { //lose 
            switch(this.theirShape) {
                case 'R':
                    return 'S';
                case 'P':
                    return 'R';
                case 'S': 
                    return 'P';
            }
        }
        if(this.inputB === 'Y') { //draw 
            switch(this.theirShape) {
                case 'R':
                    return 'R';
                case 'P':
                    return 'P';
                case 'S': 
                    return 'S';
            }
        }
        if(this.inputB === 'Z') { //win 
            switch(this.theirShape) {
                case 'R':
                    return 'P';
                case 'P':
                    return 'S';
                case 'S': 
                    return 'R';
            }
        }
        return '';
    }
}

function day() {
    const roundsPart1 = INPUT.trim().split('\n').map(s => new Part1Round(s));
    console.log('Part 1', sum(roundsPart1.map(r => r.score)));
    const roundsPart2 = INPUT.trim().split('\n').map(s => new Part2Round(s));
    console.log('Part 2', sum(roundsPart2.map(r => r.score)));
}
day();