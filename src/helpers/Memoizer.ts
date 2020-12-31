export default class Memoizer<Key, Value, SerializedKey = Key> {
  private cache: Map<SerializedKey, Value> = new Map();
  private compute: (Key) => Value;
  private serializeKey: (Key) => SerializedKey;
  private reviveKey: (SerializedKey) => Key;

  constructor(compute: (Key) => Value, serializeKey: (Key) => SerializedKey, reviveKey?: (SerializedKey) => Key) {
    this.compute = compute;
    this.serializeKey = serializeKey;
    this.reviveKey = reviveKey;
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

  // Evict all entries in the memo cache
  evictAll() {
    this.cache.clear();
  }

  // Evict all entries in the memo cache that the predicate returns true for
  evictSome(predicate: (Key, Value) => boolean) {
    for (const [serializedKey, value] of this.cache.entries()) {
      if (predicate(this.reviveKey(serializedKey), value)) {
        this.cache.delete(serializedKey);
      }
    }
  }
}
