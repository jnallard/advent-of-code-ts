export const sum = (nums: number[]) => nums.reduce((sum, newValue) => sum + newValue, 0);

export function intersect<T>(...sets: Set<T>[]) { return sets.reduce((a, b) => new Set([...a].filter(x => b.has(x)))) }

export const isBetween = (value: number, min: number, max: number, inclusive: boolean) => inclusive ? value >= min && value <= max : value > min && value < max;

export function round(num: number) {
  return Math.round((num + Number.EPSILON) * 1000000) / 1000000;
}

export const bigIntMin = (...args: bigint[]) => args.reduce((m, e) => e < m ? e : m);
export const bigIntMax = (...args: bigint[]) => args.reduce((m, e) => e > m ? e : m);

type FuncParam = () => string | number | bigint;
export const execPart = (func: FuncParam, partName: string, subtitle?: string) => {
  const subtitleString = subtitle ? ` (${subtitle})` : '';
  console.log(`Starting ${partName}${subtitleString}...`);
  const startTime = new Date().getTime();
  const result = func();
  const endTime = new Date().getTime();
  console.log(`${partName}: ${result} \t\t (${endTime - startTime}ms)`)
  console.log(`==================`);
}

export const execExamplePart1 = (func: FuncParam, subtitle?: string) => {
  execPart(func, 'Example - Part 1', subtitle);
}

export const execExamplePart2 = (func: FuncParam, subtitle?: string) => {
  execPart(func, 'Example - Part 2', subtitle);
}

export const execPart1 = (func: FuncParam, subtitle?: string) => {
  execPart(func, 'Part 1', subtitle);
}

export const execPart2 = (func: FuncParam, subtitle?: string) => {
  execPart(func, 'Part 2', subtitle);
}

type AsyncFuncParam = () => Promise<string | number | bigint>;
export const execPartAsync = async (func: AsyncFuncParam, partName: string, subtitle?: string) => {
  const subtitleString = subtitle ? ` (${subtitle})` : '';
  console.log(`Starting ${partName}${subtitleString}...`);
  const startTime = new Date().getTime();
  const result = await func();
  const endTime = new Date().getTime();
  console.log(`${partName}: ${result} \t\t (${endTime - startTime}ms)`)
  console.log(`==================`);
}

export const execExamplePart1Async = (func: AsyncFuncParam, subtitle?: string) => {
  execPartAsync(func, 'Example - Part 1', subtitle);
}

export const execExamplePart2Async = (func: AsyncFuncParam, subtitle?: string) => {
  execPartAsync(func, 'Example - Part 2', subtitle);
}

export const execPart1Async = (func: AsyncFuncParam, subtitle?: string) => {
  execPartAsync(func, 'Part 1', subtitle);
}

export const execPart2Async = (func: AsyncFuncParam, subtitle?: string) => {
  execPartAsync(func, 'Part 2', subtitle);
}
