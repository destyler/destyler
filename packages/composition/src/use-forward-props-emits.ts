import { computed } from 'vue'
import { useEmitAsProps } from './use-emit-as-props'
import { useForwardProps } from './use-forward-props'

export function useForwardPropsEmits<T extends Record<string, any>, Name extends string>(props: T, emit?: (name: Name, ...args: any[]) => void) {
  const parsedProps = useForwardProps(props)
  const emitsAsProps = emit ? useEmitAsProps(emit) : {}

  return computed(() => ({
    ...parsedProps.value,
    ...emitsAsProps,
  }))
}
