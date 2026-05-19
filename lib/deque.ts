class DoubleLinkedNode<T> {
  value: T;
  prev: DoubleLinkedNode<T> | null;
  next: DoubleLinkedNode<T> | null;

  constructor(
    value: T,
    prev: DoubleLinkedNode<T> | null = null,
    next: DoubleLinkedNode<T> | null = null,
  ) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

export class Deque<T> {
  private head: DoubleLinkedNode<T> | null = null;
  private tail: DoubleLinkedNode<T> | null = null;
  private count: number = 0;

  pushLeft(value: T) {
    const newNode = new DoubleLinkedNode(value, null, this.head);
    if (this.head) {
      this.head.prev = newNode;
    }
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }
    this.count++;
  }

  pushRight(value: T) {
    const newNode = new DoubleLinkedNode(value, this.tail, null);
    if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    if (!this.head) {
      this.head = newNode;
    }
    this.count++;
  }

  popLeft(): T | undefined {
    if (!this.head) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this.count--;
    return value;
  }

  popRight(): T | undefined {
    if (!this.tail) return undefined;
    const value = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }
    this.count--;
    return value;
  }

  pop(): T | undefined {
    return this.popRight();
  }

  push(value: T) {
    this.pushRight(value);
  }

  toArray(): T[] {
    return Array.from(this);
  }

  toJSON(): T[] {
    return this.toArray();
  }

  get size(): number {
    return this.count;
  }

  get length(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
