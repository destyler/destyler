import { camelize, getCurrentInstance, toHandlerKey } from 'vue'

export function useEmitAsProps<Name extends string>(
  emit: (name: Name, ...args: any[]) => void,
) {
  const vm = getCurrentInstance()

  const emits = vm?.type.emits
  let events: Name[] = []
  const result: Record<string, any> = {}

  if (!emits?.length) {
    if (typeof emits === 'object') {
      events = Object.keys(emits) as Name[]
    }
    else {
      console.warn(
        `No emitted event found. Please check component: ${vm?.type.name}`,
      )
    }
  }
  else {
    events = emits
  }

  events?.forEach((ev) => {
    result[toHandlerKey(camelize(ev))] = (...arg: any) => emit(ev, ...arg)
  })
  return result
}
