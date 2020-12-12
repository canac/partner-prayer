import { ref, Ref } from 'vue';

export default function reactive<PropType>(instance: any, name: string) {
  const propertyRef: Ref<PropType> = ref();
  Object.defineProperty(instance, name, {
    get(): PropType {
      return propertyRef.value;
    },
    set(newValue: PropType) {
      propertyRef.value = newValue;
    }
  });
}
