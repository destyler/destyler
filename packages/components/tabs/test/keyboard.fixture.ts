import type { TriggerProps, UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)
let fixtureId = 0

function applyAttributes(element: HTMLElement, props: Record<string, unknown>) {
  for (const [name, value] of Object.entries(props)) {
    if (name.startsWith('on') || name === 'style')
      continue
    if (value == null || ((name === 'disabled' || name === 'hidden') && !value))
      element.removeAttribute(name)
    else
      element.setAttribute(name, String(value))
  }
}

function invoke(handler: unknown, element: HTMLElement, event: Event) {
  if (typeof handler === 'function')
    Reflect.apply(handler, element, [event])
}

export async function settleKeyboard() {
  // Let the real machine's ordered focus/selection and subscription work finish.
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}

export function createKeyboardFixture(context: Partial<UserDefinedContext> = {}, items: TriggerProps[] = [
  { value: 'a' },
  { value: 'disabled', disabled: true },
  { value: 'b' },
  { value: 'c' },
]) {
  const service = machine({ id: `tabs-keyboard-${++fixtureId}`, defaultValue: 'a', ...context })
  const sent: Array<Parameters<typeof service.send>[0]> = []
  const send: typeof service.send = (event) => {
    sent.push(event)
    return service.send(event)
  }
  const api = () => connect(service.getState(), send, normalize)
  const root = document.createElement('div')
  const list = document.createElement('div')
  const triggers = new Map<string, HTMLButtonElement>()
  const panels = new Map<string, HTMLElement>()
  const keyboardEvents: Array<{
    event: KeyboardEvent
    target: EventTarget | null
    currentTarget: EventTarget | null
    defaultPrevented: boolean
  }> = []
  root.append(list)

  for (const item of items) {
    const trigger = document.createElement('button')
    trigger.textContent = item.value
    triggers.set(item.value, trigger)
    list.append(trigger)
    trigger.addEventListener('focus', event => invoke(api().getTriggerProps(item).onFocus, trigger, event))
    trigger.addEventListener('blur', event => invoke(api().getTriggerProps(item).onBlur, trigger, event))
    trigger.addEventListener('click', event => invoke(api().getTriggerProps(item).onClick, trigger, event))
    const panel = document.createElement('div')
    panel.textContent = `Panel ${item.value}`
    panels.set(item.value, panel)
    root.append(panel)
  }

  list.addEventListener('keydown', (event) => {
    // Reconnect from the current snapshot, as the framework adapters do.
    invoke(api().getListProps().onKeyDown, list, event)
    keyboardEvents.push({ event, target: event.target, currentTarget: event.currentTarget, defaultPrevented: event.defaultPrevented })
  })

  function render() {
    const current = api()
    applyAttributes(root, current.getRootProps())
    applyAttributes(list, current.getListProps())
    for (const item of items) {
      applyAttributes(triggers.get(item.value)!, current.getTriggerProps(item))
      applyAttributes(panels.get(item.value)!, current.getContentProps(item))
    }
  }

  render()
  document.body.append(root)
  const unsubscribe = service.subscribe(render)
  service.start()

  return {
    service,
    api,
    root,
    list,
    triggers,
    panels,
    sent,
    keyboardEvents,
    render,
    focus(value: string) {
      triggers.get(value)!.focus({ preventScroll: true })
    },
    key(key: string, init: KeyboardEventInit = {}, target = document.activeElement!) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
      target.dispatchEvent(event)
      return event
    },
    async cleanup() {
      await settleKeyboard()
      unsubscribe()
      service.stop()
      root.remove()
    },
  }
}

export type KeyboardFixture = ReturnType<typeof createKeyboardFixture>
