export default class Memoizer<Key, Value, SerializedKey = Key> {
  private cache: Map<SerializedKey, Value> = new Map();
  private compute: (Key) => Value;
  private serializeKey: (Key) => SerializedKey;

  constructor(compute: (Key) => Value, serializeKey: (Key) => SerializedKey) {
    this.compute = compute;
    this.serializeKey = serializeKey;
  }

  // Get the value, loading it out of the cache if available
  get(key: Key): Value {
    const serializedKey: SerializedKey = this.serializeKey(key);
    const cached: Value | undefined = this.cache.get(serializedKey);
    if (cached) {
      return cached;
    }

    const computed: Value = this.compute(key);
    this.cache.set(serializedKey, computed);
    return computed;
  }

  // Clear the memo cache
  reset() {
    this.cache.clear();
  }
}
