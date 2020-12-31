import { startOfDay } from 'date-fns';

function serializeDate(day: Date): number {
  return startOfDay(day).getTime();
}

// Implement Set<Date> where Dates are properly serialized under-the-hood
export default class DaySet {
  readonly set: Set<number> = new Set();

  add(value: Date) {
    this.set.add(serializeDate(value));
  }

  clear() {
    this.set.clear();
  }

  delete(value: Date) {
    this.set.delete(serializeDate(value));
  }

  has(value: Date): boolean {
    return this.set.has(serializeDate(value));
  }
}
