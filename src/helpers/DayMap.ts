import { startOfDay } from 'date-fns';

function serializeDate(day: Date): number {
  return startOfDay(day).getTime();
}

function reviveDate(date: number) {
  return new Date(date);
}

// Implement Map<Date, T> where Dates are properly serialized under-the-hood
export default class DayMap<T> {
  private readonly map: Map<number, T>;

  constructor(entries?: Iterable<[Date, T]>) {
    this.map = new Map((entries ? [...entries] : []).map(([key, value]) => [serializeDate(key), value]));
  }

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

  *keys(): IterableIterator<Date> {
    for (const serializedKey of this.map.keys()) {
      yield reviveDate(serializedKey);
    }
  }

  values(): IterableIterator<T> {
    return this.map.values();
  }

  *entries(): IterableIterator<[Date, T]> {
    for (const [serializedKey, value] of this.map.entries()) {
      yield [reviveDate(serializedKey), value];
    }
  }
}
