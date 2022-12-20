export const sum = (nums: number[]) => nums.reduce((sum, newValue) => sum + newValue, 0);

export function intersect<T>(...sets: Set<T>[]) { return sets.reduce((a, b) => new Set([...a].filter(x => b.has(x)))) }

export const isBetween = (value: number, min: number, max: number, inclusive: boolean) => inclusive ? value >= min && value <= max : value > min && value < max;