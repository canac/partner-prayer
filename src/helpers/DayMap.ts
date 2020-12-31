import { startOfDay } from 'date-fns';

function serializeDate(day: Date): number {
  return startOfDay(day).getTime();
}

// Implement Map<Date, T> where Dates are properly serialized under-the-hood
export default class DayMap<T> {
  private readonly map: Map<number, T> = new Map();

  get(key: Date): T | undefined {
    return this.map.get(serializeDate(key));
  }

  set(key: Date, value: T) {
    this.map.set(serializeDate(key), value);
  }

  clear() {
    this.map.clear();
  }

  delete(key: Date) {
    this.map.delete(serializeDate(key));
  }

  has(key: Date): boolean {
    return this.map.has(serializeDate(key));
  }
}
