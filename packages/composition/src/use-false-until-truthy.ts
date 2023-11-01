import type { Ref } from 'vue'
import { readonly, ref, watch } from 'vue'

export default function useFalseUntilTruthy(arg: Ref<any>): Readonly<Ref<boolean>> {
  const current = ref(!!(arg.value as boolean))
  if (current.value)
    return readonly(current)
  const stop = watch(arg, (value: any) => {
    if (value as boolean) {
      current.value = true
      stop()
    }
  })
  return readonly(current)
}
