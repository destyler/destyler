import type { Dict, EventObject, MachineConfig, State, StateSchema, TComputedContext } from './type'
import { proxy, proxyWithComputed } from '@destyler/store'
import { cast } from '@destyler/utils'
import { ActionTypes } from './type'

export function createProxy<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject>(
  config: MachineConfig<TContext, TState, TEvent>,
) {
  const computedContext: Dict = config.computed ?? cast<TComputedContext<TContext>>({})
  const initialContext = config.context ?? cast<TContext>({})
  const initialTags = config.initial ? config.states?.[config.initial]?.tags : []

  const state = proxy({
    value: config.initial ?? '',
    previousValue: '',
    event: cast<Dict>({}),
    previousEvent: cast<Dict>({}),
    context: proxyWithComputed(initialContext, computedContext),
    done: false,
    tags: (initialTags ?? []) as Array<TState['tags']>,
    hasTag(tag: TState['tags']): boolean {
      return this.tags.includes(tag)
    },
    matches(...value: string[]): boolean {
      return value.includes(this.value)
    },
    can(event: string): boolean {
      return cast<any>(this).nextEvents.includes(event)
    },
    get nextEvents() {
      const stateEvents = (config.states as Dict)?.[this.value]?.on ?? {}
      const globalEvents = config?.on ?? {}
      return Object.keys({ ...stateEvents, ...globalEvents })
    },
    get changed() {
      if (this.event.value === ActionTypes.Init || !this.previousValue)
        return false
      return this.value !== this.previousValue
    },
  })

  return cast<State<TContext, TState, TEvent>>(state)
}
