/*
--- Day 7: Camel Cards ---
Your all-expenses-paid trip turns out to be a one-way, five-minute ride in an airship. (At least it's a cool airship!) It drops you off at the edge of a vast desert and descends back to Island Island.

"Did you bring the parts?"

You turn around to see an Elf completely covered in white clothing, wearing goggles, and riding a large camel.

"Did you bring the parts?" she asks again, louder this time. You aren't sure what parts she's looking for; you're here to figure out why the sand stopped.

"The parts! For the sand, yes! Come with me; I will show you." She beckons you onto the camel.

After riding a bit across the sands of Desert Island, you can see what look like very large rocks covering half of the horizon. The Elf explains that the rocks are all along the part of Desert Island that is directly above Island Island, making it hard to even get there. Normally, they use big machines to move the rocks and filter the sand, but the machines have broken down because Desert Island recently stopped receiving the parts they need to fix the machines.

You've already assumed it'll be your job to figure out why the parts stopped when she asks if you can help. You agree automatically.

Because the journey will take a few days, she offers to teach you the game of Camel Cards. Camel Cards is sort of similar to poker except it's designed to be easier to play while riding a camel.

In Camel Cards, you get a list of hands, and your goal is to order them based on the strength of each hand. A hand consists of five cards labeled one of A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2. The relative strength of each card follows this order, where A is the highest and 2 is the lowest.

Every hand is exactly one type. From strongest to weakest, they are:

Five of a kind, where all five cards have the same label: AAAAA
Four of a kind, where four cards have the same label and one card has a different label: AA8AA
Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
High card, where all cards' labels are distinct: 23456
Hands are primarily ordered based on type; for example, every full house is stronger than any three of a kind.

If two hands have the same type, a second ordering rule takes effect. Start by comparing the first card in each hand. If these cards are different, the hand with the stronger first card is considered stronger. If the first card in each hand have the same label, however, then move on to considering the second card in each hand. If they differ, the hand with the higher second card wins; otherwise, continue with the third card in each hand, then the fourth, then the fifth.

So, 33332 and 2AAAA are both four of a kind hands, but 33332 is stronger because its first card is stronger. Similarly, 77888 and 77788 are both a full house, but 77888 is stronger because its third card is stronger (and both hands have the same first and second card).

To play Camel Cards, you are given a list of hands and their corresponding bid (your puzzle input). For example:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
This example shows five hands; each hand is followed by its bid amount. Each hand wins an amount equal to its bid multiplied by its rank, where the weakest hand gets rank 1, the second-weakest hand gets rank 2, and so on up to the strongest hand. Because there are five hands in this example, the strongest hand will have rank 5 and its bid will be multiplied by 5.

So, the first step is to put the hands in order of strength:

32T3K is the only one pair and the other hands are all a stronger type, so it gets rank 1.
KK677 and KTJJT are both two pair. Their first cards both have the same label, but the second card of KK677 is stronger (K vs T), so KTJJT gets rank 2 and KK677 gets rank 3.
T55J5 and QQQJA are both three of a kind. QQQJA has a stronger first card, so it gets rank 5 and T55J5 gets rank 4.
Now, you can determine the total winnings of this set of hands by adding up the result of multiplying each hand's bid with its rank (765 * 1 + 220 * 2 + 28 * 3 + 684 * 4 + 483 * 5). So the total winnings in this example are 6440.

Find the rank of every hand in your set. What are the total winnings?

Your puzzle answer was 253603890.

--- Part Two ---
To make things a little more interesting, the Elf introduces one additional rule. Now, J cards are jokers - wildcards that can act like whatever card would make the hand the strongest type possible.

To balance this, J cards are now the weakest individual cards, weaker even than 2. The other cards stay in the same order: A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J.

J cards can pretend to be whatever card is best for the purpose of determining hand type; for example, QJJQ2 is now considered four of a kind. However, for the purpose of breaking ties between two hands of the same type, J is always treated as J, not the card it's pretending to be: JKKK2 is weaker than QQQQ2 because J is weaker than Q.

Now, the above example goes very differently:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
32T3K is still the only one pair; it doesn't contain any jokers, so its strength doesn't increase.
KK677 is now the only two pair, making it the second-weakest hand.
T55J5, KTJJT, and QQQJA are now all four of a kind! T55J5 gets rank 3, QQQJA gets rank 4, and KTJJT gets rank 5.
With the new joker rule, the total winnings in this example are 5905.

Using the new joker rule, find the rank of every hand in your set. What are the new total winnings?

Your puzzle answer was 253630098.
*/


import { execPart1, execPart2 } from "../helpers";
import { INPUT } from "./input/input-day7";

const cardValuesPart1: Record<string, number> = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    'T': 10, 
    '9': 9, 
    '8': 8, 
    '7': 7, 
    '6': 6, 
    '5': 5, 
    '4': 4, 
    '3': 3, 
    '2': 2, 
}
const cardValuesPart2: Record<string, number> = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'T': 10, 
    '9': 9, 
    '8': 8, 
    '7': 7, 
    '6': 6, 
    '5': 5, 
    '4': 4, 
    '3': 3, 
    '2': 2, 
    'J': 1,
}

const FiveOfAKind = 7;
const FourOfAKind = 6;
const FullHouse = 5;
const ThreeOfAKind = 4;
const TwoPair = 3;
const OnePair = 2;
const HighCard = 1;

class HandPart1 {
    cards: string;
    bid: number;
    counts: Record<string, number> = {};
    sortingValue: number;
    constructor(input: string) {
        const parts = input.split(' ');
        this.cards = parts[0];
        this.bid = +parts[1];
        for(let char of this.cards) {
            if(!this.counts[char]) {
                this.counts[char] = 0;
            }
            this.counts[char]++;
        }
        this.sortingValue = this.getSortingValue();
    }

    getSortingValue() {
        const cardValues = cardValuesPart1;
        const countsSorted = Object.values(this.counts).sort((a, b) => b - a);
        let handStrength: number;
        if(countsSorted[0] === 5) { // 5 of a kind
            handStrength = FiveOfAKind;
        } else if(countsSorted[0] === 4) { // 4 of a kind 
            handStrength = FourOfAKind;
        } else if(countsSorted[0] === 3 && countsSorted[1] === 2) { // full house 
            handStrength = FullHouse;
        } else if(countsSorted[0] === 3) { // 3 of a kind
            handStrength = ThreeOfAKind;
        } else if(countsSorted[0] === 2 && countsSorted[1] === 2) { // two pair 
            handStrength = TwoPair;
        }  else if(countsSorted[0] === 2) { // one pair 
            handStrength = OnePair;
        } else { // high card
            handStrength = HighCard; 
        }
        // h1,122,334,455
        const sortingValue = 
            (handStrength * 10000000000)
            + (cardValues[this.cards[0]] * 100000000) 
            + (cardValues[this.cards[1]] * 1000000) 
            + (cardValues[this.cards[2]] * 10000) 
            + (cardValues[this.cards[3]] * 100) 
            + cardValues[this.cards[4]];
        return sortingValue;
    }
}

class HandPart2 {
    cards: string;
    bid: number;
    counts: Record<string, number> = {};
    sortingValue: number;
    constructor(input: string) {
        const parts = input.split(' ');
        this.cards = parts[0];
        this.bid = +parts[1];
        for(let char of this.cards) {
            if(!this.counts[char]) {
                this.counts[char] = 0;
            }
            this.counts[char]++;
        }
        this.sortingValue = this.getSortingValue();
    }

    getSortingValue() {  // Kevin told me a better idea for handling Jacks is to just add it to the other card with the highest count
        const cardValues = cardValuesPart2;
        const countsSorted = Object.values(this.counts).sort((a, b) => b - a);
        const jackCount = this.counts['J'] ?? 0;
        let handStrength: number;
        if(countsSorted[0] === 5) { // 5 of a kind
            handStrength = FiveOfAKind;
        } else if(countsSorted[0] === 4) { // 4 of a kind 
            handStrength = FourOfAKind;
            if(jackCount === 1 || jackCount === 4) {
                handStrength = FiveOfAKind; //upgrade to 5 of a kind
            }
        } else if(countsSorted[0] === 3 && countsSorted[1] === 2) { // full house 
            handStrength = FullHouse;
            if(jackCount != 0) {
                handStrength = FiveOfAKind; //upgrade to 5 of a kind
            }
        } else if(countsSorted[0] === 3) { // 3 of a kind
            handStrength = ThreeOfAKind;
            if (jackCount === 3 ) {
                handStrength = FourOfAKind; //upgrade to 4 of a kind
            } else if (jackCount === 1 ) {
                handStrength = FourOfAKind; //upgrade to 4 of a kind
            }
        } else if(countsSorted[0] === 2 && countsSorted[1] === 2) { // two pair 
            handStrength = TwoPair;
            if(jackCount === 2) {
                handStrength = FourOfAKind; //upgrade to 4 of a kind
            } else if (jackCount === 1 ) {
                handStrength = FullHouse; //upgrade to full house
            }
        }  else if(countsSorted[0] === 2) { // one pair 
            handStrength = OnePair;
            if(jackCount === 2) {
                handStrength = ThreeOfAKind; //upgrade to 3 of a kind
            } else if (jackCount === 1 ) {
                handStrength = ThreeOfAKind; //upgrade to 3 of a kind
            }
        } else { // high card
            handStrength = HighCard; 
            if(jackCount === 1) {
                handStrength = OnePair; //upgrade to one pair
            }
        }
        // h0,102,030,405
        const sortingValue = (handStrength * 10000000000) + (cardValues[this.cards[0]] * 100000000) + (cardValues[this.cards[1]] * 1000000) + (cardValues[this.cards[2]] * 10000) + (cardValues[this.cards[3]] * 100) + cardValues[this.cards[4]];
        return sortingValue;
    }
}

execPart1(() => {
    const hands = INPUT.split('\n').filter(l => !!l).map(l => new HandPart1(l));
    hands.sort((a, b) => a.sortingValue - b.sortingValue);
    let result = 0;
    for(let i = 0; i < hands.length; i++) {
        result += (i + 1) * hands[i].bid;
    }
    return result;
})

execPart2(() => {
    const hands = INPUT.split('\n').filter(l => !!l).map(l => new HandPart2(l));
    hands.sort((a, b) => a.sortingValue - b.sortingValue);
    let result = 0;
    for(let i = 0; i < hands.length; i++) {
        result += (i + 1) * hands[i].bid;
    }
    return result;
})
