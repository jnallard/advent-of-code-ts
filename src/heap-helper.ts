import * as math from "mathjs";

/** TODO: replace with my own heap implementation or better type safe library . Mathjs doesn't have types for their FibonacciHeap */
export class MathJSMinHeap<T> {
  private readonly abstractedHeap = new (math as any).FibonacciHeap();

  insert(number: number, value: T) {
    this.abstractedHeap.insert(number, value);
  }

  isEmpty() {
    return this.abstractedHeap.isEmpty();
  }

  size() {
    return this.abstractedHeap.size();
  }

  extractMinimum() {
    return this.abstractedHeap.extractMinimum() as {key: number, value: T};
  }
}