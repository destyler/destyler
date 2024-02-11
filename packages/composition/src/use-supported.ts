import { computed } from 'vue'
import { useMounted } from './use-mounted'

export function useSupported(callback: () => unknown) {
  const isMounted = useMounted()

  return computed(() => {
    // eslint-disable-next-line no-unused-expressions
    isMounted.value
    return Boolean(callback())
  })
}
