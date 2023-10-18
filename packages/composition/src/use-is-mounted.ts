import type {
  Ref,
} from 'vue'
import {
  onMounted,
  readonly,
  ref,
} from 'vue'

export default function isMounted(): Readonly<Ref<boolean>> {
  const isMounted = ref(false)
  onMounted(() => {
    isMounted.value = true
  })
  return readonly(isMounted)
}
