export const SAMPLE_INPUT_1 = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`

export const SAMPLE_INPUT_2 = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`

export const INPUT = `
Register A: 38610541
Register B: 0
Register C: 0

Program: 2,4,1,1,7,5,1,5,4,3,5,5,0,3,3,0
`

/*
Output length = 16

2,4: bst --- A % 8 -> B         // B becomes 0 - 7
1,1: bxl --- B ^ 1 -> B         // even? B++. Odd? B--.     EX: B moves from 0->1, 1->0, 2->3, 3->2, 4->5, 5->4, 6->7, 7->8
7,5: cdv --- A >> B => C        // 
1,5: bxl --- B ^ 5 -> B         // 
4,3: bxc --- B ^ C -> B         // 
5,5: out --- B % 8 -> OUT       // 
0,3: adv --- a >> 3 -> A        // So the loop will last 16 times when A divided by 8 16 times becomes zero for the first time. rangeish ~ 100_000_000_000_000
3,0: jnz --- if(A === 0) exit otherwise restart loop

(((A % 8) ^ 1) ^ 5) ^ (A >> ((A % 8) ^ 1))) % 8 -> out
A = A >> 3

 */

