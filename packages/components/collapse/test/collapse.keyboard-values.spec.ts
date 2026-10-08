import type { PropTypes } from '@destyler/types'
import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer<PropTypes>(value => value)
const services: Array<ReturnType<typeof machine>> = []
const roots: HTMLElement[] = []

afterEach(() => {
  services.splice(0).forEach(service => service.stop())
  roots.splice(0).forEach(root => root.remove())
})

function setup(options: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'keyboard-values', ...options })
  services.push(service)
  service.start()
  const root = document.createElement('div')
  root.id = 'collapse:keyboard-values'
  document.body.append(root)
  roots.push(root)
  const buttons = new Map<string, HTMLButtonElement>()
  for (const value of ['before', '', 'disabled', 'after']) {
    const button = document.createElement('button')
    const props = connect(service.state, service.send, normalize).getItemTriggerProps({ value, disabled: value === 'disabled' })
    button.id = props.id!
    button.disabled = !!props.disabled
    button.setAttribute('aria-controls', String(props['aria-controls']))
    button.setAttribute('data-ownedby', 'collapse:keyboard-values')
    button.addEventListener('focus', () => connect(service.state, service.send, normalize).getItemTriggerProps({ value }).onFocus?.({} as never))
    button.addEventListener('blur', () => connect(service.state, service.send, normalize).getItemTriggerProps({ value }).onBlur?.({} as never))
    button.addEventListener('keydown', event => connect(service.state, service.send, normalize).getItemTriggerProps({ value }).onKeyDown?.(event as never))
    root.append(button)
    buttons.set(value, button)
  }
  return { service, buttons, root }
}

describe('collapse keyboard navigation with valid string values', () => {
  it.each([
    ['vertical', 'ltr', 'ArrowDown', 'after'],
    ['vertical', 'ltr', 'ArrowUp', 'before'],
    ['horizontal', 'ltr', 'ArrowRight', 'after'],
    ['horizontal', 'ltr', 'ArrowLeft', 'before'],
    ['horizontal', 'rtl', 'ArrowLeft', 'after'],
    ['horizontal', 'rtl', 'ArrowRight', 'before'],
  ] as const)('%s %s %s navigates from the empty-string item', (orientation, dir, key, target) => {
    const { service, buttons } = setup({ orientation, dir })
    const empty = buttons.get('')!
    empty.focus()
    expect(service.state.context.focusedValue).toBe('')
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    empty.dispatchEvent(event)
    expect(document.activeElement).toBe(buttons.get(target))
    expect(service.state.context.focusedValue).toBe(target)
    expect(event.defaultPrevented).toBe(true)
  })

  it('navigates to an empty-string item from a nonempty value', () => {
    const { service, buttons } = setup()
    buttons.get('before')!.focus()
    buttons.get('before')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement).toBe(buttons.get(''))
    expect(service.state.context.focusedValue).toBe('')
  })

  it.each(['GOTO.NEXT', 'GOTO.PREV'])('%s does not invent focus when no item is focused', (type) => {
    const { service, root } = setup()
    const outside = document.createElement('button')
    root.append(outside)
    outside.focus()
    service.send({ type: 'TRIGGER.FOCUS', value: null })
    service.send(type)
    expect(service.state.context.focusedValue).toBeNull()
    expect(document.activeElement).toBe(outside)
  })
})
