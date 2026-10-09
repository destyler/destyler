import type { PropTypes } from '@destyler/types'
import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer<PropTypes>(props => props)
let id = 0
export type PasteOwnership = 'uncontrolled' | 'accept' | 'veto'
export function createPasteFixture(ownership: PasteOwnership = 'uncontrolled', context: Partial<UserDefinedContext> = {}, implementation = { machine, connect }) {
  const changes: Array<{ value: string[], valueAsString: string }> = []
  const timeline: Array<{ phase: string, values: string[], accepted: string[], caret: number | null, focusedIndex: number }> = []
  const service = implementation.machine({ id: `otp-paste-${++id}`, translations: { inputLabel: index => `Digit ${index + 1}` }, ...(ownership === 'uncontrolled' ? { defaultValue: ['1', '2', '3'] } : { value: ['1', '2', '3'] }), ...context, onValueChange(details) {
    changes.push(details)
    observe('request')
    if (ownership === 'accept')
      service.setContext({ value: details.value })
  } })
  const api = () => implementation.connect(service.getState(), service.send, normalize)
  const root = document.createElement('div')
  root.id = String(api().getRootProps().id)
  const listeners = new AbortController()
  const inputEvents: InputEvent[] = []
  let afterInput: ((index: number) => void) | undefined
  const inputs = ['1', '2', '3'].map((_, index) => {
    const input = document.createElement('input')
    const props = api().getInputProps({ index })
    input.id = String(props.id)
    input.type = String(props.type)
    input.dataset.ownedby = String(props['data-ownedby'])
    input.value = String(props.defaultValue)
    input.addEventListener('focus', event => api().getInputProps({ index }).onFocus?.(event as never), { signal: listeners.signal })
    input.addEventListener('blur', event => api().getInputProps({ index }).onBlur?.(event as never), { signal: listeners.signal })
    input.addEventListener('beforeinput', event => api().getInputProps({ index }).onBeforeInput?.(event as never), { signal: listeners.signal })
    input.addEventListener('input', (event) => {
      inputEvents.push(event as InputEvent)
      observe('input-before', index)
      api().getInputProps({ index }).onChange?.(event as never)
      observe('input-after', index)
      afterInput?.(index)
    }, { signal: listeners.signal })
    root.append(input)
    return input
  })
  const hidden = document.createElement('input')
  hidden.id = String(api().getHiddenInputProps().id)
  hidden.value = api().valueAsString
  root.append(hidden)
  function observe(phase: string, index = 0) {
    timeline.push({ phase, values: inputs.map(input => input.value), accepted: Array.from(api().value), caret: inputs[index].selectionStart, focusedIndex: service.state.context.focusedIndex })
  }
  document.body.append(root)
  service.start()
  let disposed = false
  return {
    service,
    api,
    root,
    inputs,
    hidden,
    changes,
    timeline,
    inputEvents,
    observe,
    focus(index = 0) {
      inputs[index].focus()
    },
    afterInput(callback: (index: number) => void) {
      afterInput = callback
    },
    paste(index: number, value: string, focus = true) {
      if (focus)
        inputs[index].focus()
      inputs[index].value = value
      inputs[index].dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste', data: value, bubbles: true, cancelable: true }))
    },
    cleanup() {
      if (disposed)
        return
      disposed = true
      listeners.abort()
      service.stop()
      root.remove()
    },
  }
}
export type PasteFixture = ReturnType<typeof createPasteFixture>
