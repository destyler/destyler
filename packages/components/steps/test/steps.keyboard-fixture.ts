import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
let nextId = 0

export function mountSteps(context: Partial<UserDefinedContext> = {}) {
  const onStepChange = vi.fn(context.onStepChange)
  const service = machine({ id: `keyboard-${nextId++}`, count: 3, ...context, onStepChange }).start()
  const api = () => connect(service.getState(), service.send, normalize)
  const host = document.createElement('div')
  document.body.append(host)
  const bindings: VoidFunction[] = []
  const cleanups: VoidFunction[] = []
  function bind<T extends HTMLElement>(element: T, getProps: () => Record<string, unknown>) {
    bindings.push(() => {
      for (const [key, value] of Object.entries(getProps())) {
        if (typeof value === 'function')
          continue
        if (key === 'disabled' && element instanceof HTMLButtonElement)
          element.disabled = Boolean(value)
        else if (key === 'hidden')
          element.hidden = Boolean(value)
        else if (value == null)
          element.removeAttribute(key)
        else
          element.setAttribute(key, String(value))
      }
    })
    for (const [eventName, propName] of [['click', 'onClick'], ['keydown', 'onKeyDown'], ['focus', 'onFocus'], ['blur', 'onBlur']]) {
      const listener = (event: Event) => {
        const handler = getProps()[propName]
        if (typeof handler === 'function')
          Reflect.apply(handler, element, [event])
      }
      element.addEventListener(eventName, listener)
      cleanups.push(() => element.removeEventListener(eventName, listener))
    }
    return element
  }
  const before = document.createElement('button')
  before.textContent = 'Before steps'
  const list = bind(document.createElement('div'), () => api().getListProps())
  list.setAttribute('aria-label', 'Example steps')
  host.append(before, list)
  const triggers = Array.from({ length: api().count }, (_, index) => {
    const trigger = bind(document.createElement('button'), () => api().getTriggerProps({ index }))
    trigger.textContent = `Step ${index + 1}`
    list.append(trigger)
    return trigger
  })
  const panels = Array.from({ length: api().count + 1 }, (_, index) => {
    const panel = bind(document.createElement('div'), () => api().getContentProps({ index }))
    panel.textContent = index === api().count ? 'All steps complete' : `Step ${index + 1} content`
    host.append(panel)
    return panel
  })
  const prev = bind(document.createElement('button'), () => api().getPrevTriggerProps())
  prev.textContent = 'Previous'
  const next = bind(document.createElement('button'), () => api().getNextTriggerProps())
  next.textContent = 'Next'
  const after = document.createElement('button')
  after.textContent = 'After steps'
  host.append(prev, next, after)
  const render = () => bindings.forEach(update => update())
  const unsubscribe = service.subscribe(render)
  render()
  return {
    service,
    api,
    host,
    list,
    triggers,
    panels,
    before,
    after,
    next,
    prev,
    onStepChange,
    tabIndexes: () => triggers.map(trigger => trigger.tabIndex),
    async key(key: string, options: KeyboardEventInit = {}) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options })
      document.activeElement?.dispatchEvent(event)
      await Promise.resolve()
      return event
    },
    async sync(context: Partial<UserDefinedContext>) {
      service.setContext(context)
      await Promise.resolve()
    },
    dispose() {
      unsubscribe()
      cleanups.forEach(cleanup => cleanup())
      service.stop()
      host.remove()
    },
  }
}
