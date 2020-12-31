import DayMap from './DayMap';

// Extend DayMap so that non-existent gets return a default value
export default class DefaultDayMap<T> extends DayMap<T> {
  private readonly defaultVal: (Date) => T;

  constructor(defaultVal: (Date) => T, entries?: Iterable<[Date, T]>) {
    super(entries);

    this.defaultVal = defaultVal;
  }

  get(key: Date): T {
    if (this.has(key)) {
      return super.get(key);
    } else {
      return this.defaultVal(key);
    }
  }
}
