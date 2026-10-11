// @vitest-environment happy-dom
import type { PropTypes } from '../../../types'
import type { UserDefinedContext, ValueChangeDetails } from '../src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createNormalizer } from '../../../types'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

interface InputProps {
  id: string
  defaultValue: string
  readOnly?: boolean
  disabled: boolean
  onFocus: EventListener
  onBlur: EventListener
}
interface ScrubberProps {
  id: string
  onMouseDown: EventListener
}
type NativeProps = Omit<PropTypes, 'input' | 'element'> & { input: InputProps, element: ScrubberProps }
type Ownership = 'uncontrolled' | 'accept' | 'veto'
type Interaction = 'wheel' | 'scrubber'
const normalize = createNormalizer<NativeProps>(props => props)
const cleanups: Array<() => void> = []
let originalStyles: Array<[HTMLElement, string | null]>

beforeEach(() => {
  originalStyles = [document.body, document.documentElement].map(element => [element, element.getAttribute('style')])
})
afterEach(() => {
  try {
    for (const cleanup of cleanups.splice(0).reverse())
      cleanup()
  }
  finally {
    for (const [element, style] of originalStyles) {
      if (style === null)
        element.removeAttribute('style')
      else
        element.setAttribute('style', style)
    }
  }
})

function mount(ownership: Ownership, props: Partial<UserDefinedContext> = {}) {
  let service: ReturnType<typeof machine>
  const onValueChange = vi.fn(({ value }: ValueChangeDetails) => {
    if (ownership === 'accept')
      service.setContext({ value })
  })
  service = machine({
    id: 'readonly-number-input',
    focusInputOnChange: false,
    allowMouseWheel: true,
    ...(ownership === 'uncontrolled' ? { defaultValue: '50' } : { value: '50' }),
    onValueChange,
    ...props,
  })
  // Permission acquisition is not under test; mouse listeners remain real.
  service.setOptions({ activities: { activatePointerLock() {} } })
  const send = vi.spyOn(service, 'send')
  const api = () => connect(service.getState(), service.send, normalize)
  const form = document.createElement('form')
  const input = document.createElement('input')
  input.name = 'quantity'
  const inputProps = api().getInputProps()
  input.id = inputProps.id
  input.defaultValue = inputProps.defaultValue
  input.readOnly = !!inputProps.readOnly
  input.disabled = inputProps.disabled
  input.addEventListener('focus', event => api().getInputProps().onFocus(event))
  input.addEventListener('blur', event => api().getInputProps().onBlur(event))
  const scrubber = document.createElement('div')
  scrubber.id = api().getScrubberProps().id
  scrubber.addEventListener('mousedown', event => api().getScrubberProps().onMouseDown(event))
  form.append(input, scrubber)
  document.body.append(form)
  service.start()
  cleanups.push(() => {
    service.stop()
    form.remove()
  })
  return { service, api, form, input, scrubber, onValueChange, send }
}
function press(scrubber: HTMLElement) {
  const event = new MouseEvent('mousedown', { button: 0, bubbles: true, cancelable: true })
  scrubber.dispatchEvent(event)
  return event
}
function move() {
  const event = new MouseEvent('mousemove', { bubbles: true })
  Object.defineProperties(event, { movementX: { value: 5 }, movementY: { value: 0 } })
  document.dispatchEvent(event)
}
function wheel(input: HTMLInputElement, deltaY = -1) {
  const event = new WheelEvent('wheel', { deltaY, cancelable: true })
  input.dispatchEvent(event)
  return event
}
function begin(view: ReturnType<typeof mount>, interaction: Interaction) {
  if (interaction === 'wheel')
    view.input.focus()
  else
    return press(view.scrubber)
}
function change(view: ReturnType<typeof mount>, interaction: Interaction) {
  if (interaction === 'wheel')
    return wheel(view.input)
  move()
}

describe.each<Ownership>(['uncontrolled', 'accept', 'veto'])('readonly interactions with %s ownership', (ownership) => {
  it.each<Interaction>(['wheel', 'scrubber'])('ignores %s when initially readonly', (interaction) => {
    const view = mount(ownership, { readOnly: true })
    const startEvent = begin(view, interaction)
    const event = change(view, interaction)
    expect(startEvent?.defaultPrevented ?? false).toBe(false)
    expect(view.onValueChange).not.toHaveBeenCalled()
    expect(view.service.state.context.value).toBe('50')
    expect(view.input.value).toBe('50')
    expect(new FormData(view.form).get('quantity')).toBe('50')
    expect(event?.defaultPrevented ?? false).toBe(false)
    if (interaction === 'scrubber')
      expect(view.service.state.value).toBe('idle')
  })

  it.each<Interaction>(['wheel', 'scrubber'])('preserves normal editable %s behavior', (interaction) => {
    const view = mount(ownership)
    begin(view, interaction)
    const event = change(view, interaction)
    expect(view.onValueChange).toHaveBeenCalledExactlyOnceWith({ value: '51', valueAsNumber: 51 })
    expect(view.service.state.context.value).toBe(ownership === 'veto' ? '50' : '51')
    if (interaction === 'wheel')
      expect(event?.defaultPrevented).toBe(true)
  })

  it.each<Interaction>(['wheel', 'scrubber'])('reads current readonly state in an active %s listener', (interaction) => {
    const view = mount(ownership)
    begin(view, interaction)
    view.service.setContext({ readOnly: true })
    const event = change(view, interaction)
    expect(view.onValueChange).not.toHaveBeenCalled()
    expect(view.service.state.context.value).toBe('50')
    expect(view.input.value).toBe('50')
    expect(new FormData(view.form).get('quantity')).toBe('50')
    expect(event?.defaultPrevented ?? false).toBe(false)
    if (interaction === 'scrubber') {
      // Blocking edits does not introduce a mid-drag pointer-lock exit policy.
      expect(view.service.state.value).toBe('scrubbing')
      expect(document.getElementById('number-input:readonly-number-input:cursor')).not.toBeNull()
      document.dispatchEvent(new MouseEvent('mouseup'))
      expect(view.service.state.value).toBe('focused')
      expect(document.getElementById('number-input:readonly-number-input:cursor')).toBeNull()
    }
  })
})

it.each<Interaction>(['wheel', 'scrubber'])('resumes %s when readonly is cleared without remounting', (interaction) => {
  const view = mount('uncontrolled')
  begin(view, interaction)
  view.service.setContext({ readOnly: true })
  change(view, interaction)
  expect(view.onValueChange).not.toHaveBeenCalled()
  view.service.setContext({ readOnly: false })
  change(view, interaction)
  expect(view.onValueChange).toHaveBeenCalledExactlyOnceWith({ value: '51', valueAsNumber: 51 })
})

it.each<Interaction>(['wheel', 'scrubber'])('ignores %s when initially disabled', (interaction) => {
  const view = mount('uncontrolled', { disabled: true })
  begin(view, interaction)
  change(view, interaction)
  expect(view.onValueChange).not.toHaveBeenCalled()
  expect(view.service.state.context.value).toBe('50')
})

it.each<Interaction>(['wheel', 'scrubber'])('reads current disabled state in an active %s listener', (interaction) => {
  const view = mount('uncontrolled')
  begin(view, interaction)
  view.service.setContext({ disabled: true })
  const event = change(view, interaction)
  expect(view.onValueChange).not.toHaveBeenCalled()
  expect(view.service.state.context.value).toBe('50')
  expect(event?.defaultPrevented ?? false).toBe(false)
})

it('preserves wheel direction and ignores zero vertical movement', () => {
  const view = mount('uncontrolled')
  view.input.focus()
  wheel(view.input, 1)
  wheel(view.input, 0)
  wheel(view.input, -1)
  expect(view.onValueChange.mock.calls.map(([details]) => details.value)).toEqual(['49', '50'])
})

it('does not install wheel behavior when allowMouseWheel is false', () => {
  const view = mount('uncontrolled', { allowMouseWheel: false })
  view.input.focus()
  expect(wheel(view.input).defaultPrevented).toBe(false)
  expect(view.onValueChange).not.toHaveBeenCalled()
})

it('preserves explicit API value changes while readonly', () => {
  const view = mount('uncontrolled', { readOnly: true })
  view.api().increment()
  view.api().decrement()
  expect(view.onValueChange.mock.calls.map(([details]) => details.value)).toEqual(['51', '50'])
})

it.each<Interaction>(['wheel', 'scrubber'])('removes the %s listener on stop', (interaction) => {
  const view = mount('uncontrolled')
  begin(view, interaction)
  view.service.stop()
  view.send.mockClear()
  change(view, interaction)
  expect(view.send).not.toHaveBeenCalled()
  expect(view.onValueChange).not.toHaveBeenCalled()
})
