export const sum = (nums: number[]) => nums.reduce((sum, newValue) => sum + newValue, 0);

export function intersect<T>(...sets: Set<T>[]) { return sets.reduce((a, b) => new Set([...a].filter(x => b.has(x)))) }

export const isBetween = (value: number, min: number, max: number, inclusive: boolean) => inclusive ? value >= min && value <= max : value > min && value < max;

export const execPart = (func: () => string | number, partName: string) => {
  console.log(`Starting ${partName}...`);
  const startTime = new Date().getTime();
  const result = func();
  const endTime = new Date().getTime();
  console.log(`${partName}: ${result} \t\t (${endTime - startTime}ms)`)
  console.log(`==================`);
}

export const execExamplePart1 = (func: () => string | number) => {
  execPart(func, 'Example - Part 1');
}

export const execExamplePart2 = (func: () => string | number) => {
  execPart(func, 'Example - Part 2');
}

export const execPart1 = (func: () => string | number) => {
  execPart(func, 'Part 1');
}

export const execPart2 = (func: () => string | number) => {
  execPart(func, 'Part 2');
}