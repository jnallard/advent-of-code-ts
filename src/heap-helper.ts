type HeapEntry<T> = {value: number, data: T};

/** Writing myself, but following an online guide. Need to refresh myself on heaps. */
export class MinHeap<T> {
  private values: HeapEntry<T>[] = [];

  size() {
    return this.values.length;
  }

  peek() {
    return this.values[0];
  }

  insert(value: number, data: T) {
    this.values.push({value, data});
    this.heapifyUp();
  }

  extractMin() {
    if (this.size() === 0) {
      return undefined;
    }

    const minKvp = this.values[0];
    const lastKvp = this.values.pop()!;
    if (this.size() > 0) {
      this.values[0] = lastKvp;
      this.heapifyDown();
    }
    return minKvp;
  }

  heapifyUp() {
    let index = this.size() - 1;
    while(index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.values[parentIndex].value > this.values[index].value) {
        this.swap(parentIndex, index);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  heapifyDown() {
    let index = 0;
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestChildIndex = index;

      if (leftChildIndex < this.size() && this.values[leftChildIndex].value < this.values[smallestChildIndex].value) {
        smallestChildIndex = leftChildIndex;
      }

      if (rightChildIndex < this.size() && this.values[rightChildIndex].value < this.values[smallestChildIndex].value) {
        smallestChildIndex = rightChildIndex;
      }

      if (smallestChildIndex !== index) {
        this.swap(index, smallestChildIndex);
        index = smallestChildIndex;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number) {
    [this.values[i], this.values[j]] = [this.values[j], this.values[i]];
  }
}