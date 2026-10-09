import type { PropTypes } from '@destyler/types'
import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer<PropTypes>(props => props)
let id = 0
export type Ownership = 'uncontrolled' | 'accept' | 'veto'

export function createReadonlyFixture(ownership: Ownership = 'uncontrolled', context: Partial<UserDefinedContext> = {}) {
  const changes: Array<{ value: string[], valueAsString: string }> = []
  const initial = ['1', '2', '3']
  const service = machine({
    id: `otp-readonly-${++id}`,
    name: 'otp',
    translations: { inputLabel: index => `Digit ${index + 1}` },
    readOnly: true,
    ...(ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial }),
    ...context,
    onValueChange(details) {
      changes.push(details)
      if (ownership === 'accept')
        service.setContext({ value: details.value })
    },
  })
  const api = () => connect(service.getState(), service.send, normalize)
  const listeners = new AbortController()
  const form = document.createElement('form')
  const root = document.createElement('div')
  root.id = String(api().getRootProps().id)
  form.append(root)
  const hidden = document.createElement('input')
  hidden.id = String(api().getHiddenInputProps().id)
  hidden.name = 'otp'
  hidden.value = initial.join('')
  hidden.tabIndex = -1
  root.append(hidden)
  let submissions = 0
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submissions++
  }, { signal: listeners.signal })
  const keyboardEvents: KeyboardEvent[] = []
  const inputs = initial.map((value, index) => {
    const el = document.createElement('input')
    const props = api().getInputProps({ index })
    el.id = String(props.id)
    el.type = String(props.type)
    el.dataset.ownedby = String(props['data-ownedby'])
    el.value = value
    el.addEventListener('focus', event => api().getInputProps({ index }).onFocus?.(event as never), { signal: listeners.signal })
    el.addEventListener('blur', event => api().getInputProps({ index }).onBlur?.(event as never), { signal: listeners.signal })
    el.addEventListener('keydown', (event) => {
      api().getInputProps({ index }).onKeyDown?.(event as never)
      keyboardEvents.push(event)
    }, { signal: listeners.signal })
    root.append(el)
    return el
  })
  function render() {
    inputs.forEach((el, index) => {
      const props = api().getInputProps({ index })
      el.readOnly = !!props.readOnly
      el.disabled = !!props.disabled
    })
  }
  render()
  document.body.append(form)
  const unsubscribe = service.subscribe(render)
  service.start()
  let disposed = false
  return {
    service,
    api,
    form,
    inputs,
    hidden,
    changes,
    keyboardEvents,
    submissions: () => submissions,
    focus(index = 1) { inputs[index].focus() },
    key(key: string, init: KeyboardEventInit = {}, canceled = false) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
      if (canceled)
        event.preventDefault()
      document.activeElement?.dispatchEvent(event)
      return event
    },
    cleanup() {
      if (disposed)
        return
      disposed = true
      listeners.abort()
      unsubscribe()
      service.stop()
      form.remove()
    },
  }
}

export type ReadonlyFixture = ReturnType<typeof createReadonlyFixture>
