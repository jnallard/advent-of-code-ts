/*

*/


import { execPart, execPart1, execPart2 } from "../helpers";
import { PART_2_RACE, RACE_1, RACE_2, RACE_3, RACE_4, RaceInput } from "./input/input-day6";

class Race {
    raceWins = 0;
    constructor(public input: RaceInput) {
        for(let i = 0; i <= input.time; i++) {
            if(this.getDistance(i) > input.recordDistance) {
                this.raceWins++;
            }
        }
        console.log(this);
    }

    public getDistance(chargeTime: number) {
        const speed = chargeTime;
        const distance = (this.input.time - chargeTime) * speed;
        return distance;
    }
}

// execPart(() => {
//     return '';
// }, 'sample');

execPart1(() => {
    const race1 = new Race(RACE_1);
    const race2 = new Race(RACE_2);
    const race3 = new Race(RACE_3);
    const race4 = new Race(RACE_4);
    return race1.raceWins * race2.raceWins * race3.raceWins * race4.raceWins;
})

execPart2(() => {
    const race = new Race(PART_2_RACE);
    return  race.raceWins;
})
