import type { PropTypes } from '@destyler/types'
import type { CheckedChangeDetails, CheckedState } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

interface InputProps {
  id: string
  type: string
  name: string
  value: string
  defaultChecked: boolean
  onClick: EventListener
}
type NativeProps = Omit<PropTypes, 'input'> & { input: InputProps }
type Ownership = 'uncontrolled' | 'accept' | 'veto'

const normalizer = createNormalizer<NativeProps>(p => p)
const cleanups: Array<() => void> = []
const settle = () => new Promise<void>(resolve => setTimeout(resolve, 0))
afterEach(() => {
  for (const fn of cleanups.splice(0).reverse())
    fn()
  vi.restoreAllMocks()
})

function mount({ initial = 'indeterminate', mode = 'uncontrolled', document: doc = document, activities = true }: { initial?: CheckedState, mode?: Ownership, document?: Document, activities?: boolean } = {}) {
  let service: ReturnType<typeof machine>
  const changes = vi.fn(({ checked }: CheckedChangeDetails) => {
    if (mode === 'accept')
      service.setContext({ checked })
  })
  service = machine({ id: 'challenge', name: 'flag', ...(mode === 'uncontrolled' ? { defaultChecked: initial } : { checked: initial }), onCheckedChange: changes, getRootNode: () => doc })
  // Reentrancy probes isolate the ready action from earlier activity lookups.
  if (!activities)
    service.config.activities = []
  const api = () => connect(service.getState(), service.send, normalizer)
  const form = doc.createElement('form')
  const input = doc.createElement('input')
  const props = api().getHiddenInputProps()
  Object.assign(input, { id: props.id, type: props.type, name: props.name, value: props.value, defaultChecked: props.defaultChecked })
  input.addEventListener('click', props.onClick)
  const events = vi.fn()
  for (const event of ['click', 'input', 'change'])
    input.addEventListener(event, events)
  form.append(input)
  doc.body.append(form)
  cleanups.push(() => {
    service.stop()
    form.remove()
  })
  return { service, api, input, form, changes, events }
}

for (const mode of ['uncontrolled', 'accept', 'veto'] as const) {
  for (const path of ['input.click()', 'API toggle']) {
    it(`${mode}: ${path} after natural mixed startup preserves ownership and one proposal`, async () => {
      const { service, api, input, form, changes, events } = mount({ mode })
      const checkedWrite = vi.spyOn(input, 'checked', 'set')
      const defaultWrite = vi.spyOn(input, 'defaultChecked', 'set')
      service.start()
      expect(input.indeterminate).toBe(true)
      expect(input.checked).toBe(false)
      expect(input.defaultChecked).toBe(false)
      expect(new FormData(form).get('flag')).toBe(null)
      expect(events).not.toHaveBeenCalled()
      expect(changes).not.toHaveBeenCalled()
      expect(checkedWrite).not.toHaveBeenCalled()
      expect(defaultWrite).not.toHaveBeenCalled()
      if (path === 'API toggle')
        api().toggleChecked()
      else
        input.click()
      await settle()
      const accepted = mode !== 'veto'
      expect(service.state.context.checked).toBe(accepted ? true : 'indeterminate')
      expect(input.indeterminate).toBe(!accepted)
      expect(input.checked).toBe(accepted)
      expect(new FormData(form).get('flag')).toBe(accepted ? 'on' : null)
      expect(changes.mock.calls).toEqual([[{ checked: true }]])
      expect(events.mock.calls.filter(([event]) => event.type === 'click')).toHaveLength(1)
    })
  }
}

for (const next of [false, true, 'indeterminate'] as const) {
  it(`current-run context update to ${next} in root lookup uses current accepted state`, async () => {
    const { service, input, events, changes } = mount({ initial: next === 'indeterminate' ? false : 'indeterminate', activities: false })
    let once = true
    service.setContext({ getRootNode: () => {
      if (once) {
        once = false
        service.setContext({ checked: next })
      }
      return document
    } })
    service.start()
    expect(input.indeterminate).toBe(next === 'indeterminate')
    await settle()
    expect(service.state.context.checked).toBe(next)
    expect(input.indeterminate).toBe(next === 'indeterminate')
    expect(events).not.toHaveBeenCalled()
    expect(changes).not.toHaveBeenCalled()
  })
}

it('getElementById same-value restart gives new ShadowRoot sole initialization ownership', async () => {
  const { service, input, changes, events } = mount({ activities: false })
  const host = document.createElement('div')
  document.body.append(host)
  const shadow = host.attachShadow({ mode: 'open' })
  const replacement = input.cloneNode() as HTMLInputElement
  shadow.append(replacement)
  cleanups.push(() => host.remove())
  const oldWrite = vi.spyOn(input, 'indeterminate', 'set')
  const newWrite = vi.spyOn(replacement, 'indeterminate', 'set')
  let once = true
  const restart = () => {
    if (!once)
      return
    once = false
    service.stop()
    service.setContext({ getRootNode: () => shadow })
    service.start()
  }
  const original = document.getElementById.bind(document)
  vi.spyOn(document, 'getElementById').mockImplementation((id) => {
    const found = original(id)
    restart()
    return found
  })
  service.start()
  await settle()
  expect(service.state.value).toBe('ready')
  expect(input.indeterminate).toBe(false)
  expect(replacement.indeterminate).toBe(true)
  expect(oldWrite).not.toHaveBeenCalled()
  expect(newWrite).toHaveBeenCalledTimes(1)
  expect(changes).not.toHaveBeenCalled()
  expect(events).not.toHaveBeenCalled()
})

it('owner document lookup initializes only its input despite a same-ID main-document decoy', () => {
  const iframe = document.createElement('iframe')
  document.body.append(iframe)
  cleanups.push(() => iframe.remove())
  const owner = iframe.contentDocument!
  const { service, input, changes, events } = mount({ document: owner })
  const decoy = document.createElement('input')
  decoy.id = input.id
  decoy.type = 'checkbox'
  document.body.append(decoy)
  cleanups.push(() => decoy.remove())
  service.start()
  expect(input.ownerDocument).toBe(owner)
  expect(input.indeterminate).toBe(true)
  expect(decoy.indeterminate).toBe(false)
  expect(changes).not.toHaveBeenCalled()
  expect(events).not.toHaveBeenCalled()
})

it('stop from the indeterminate setter leaves no subsequent initialization tail', async () => {
  const { service, input, changes, events } = mount({ activities: false })
  const native = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'indeterminate')!
  const writes: boolean[] = []
  Object.defineProperty(input, 'indeterminate', { configurable: true, get() {
    return native.get!.call(this)
  }, set(value) {
    writes.push(value)
    native.set!.call(this, value)
    service.stop()
    native.set!.call(this, false)
  } })
  service.start()
  await settle()
  expect(service.state.value).toBe('')
  expect(input.indeterminate).toBe(false)
  expect(writes).toEqual([true])
  expect(changes).not.toHaveBeenCalled()
  expect(events).not.toHaveBeenCalled()
})

it('restart from native property setter initializes replacement once and preserves its run', async () => {
  const { service, input, changes, events } = mount({ activities: false })
  const host = document.createElement('div')
  document.body.append(host)
  const shadow = host.attachShadow({ mode: 'open' })
  const replacement = input.cloneNode() as HTMLInputElement
  shadow.append(replacement)
  cleanups.push(() => host.remove())
  const native = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'indeterminate')!
  const writes: boolean[] = []
  const newWrite = vi.spyOn(replacement, 'indeterminate', 'set')
  Object.defineProperty(input, 'indeterminate', { configurable: true, get() {
    return native.get!.call(this)
  }, set(value) {
    writes.push(value)
    native.set!.call(this, value)
    service.stop()
    native.set!.call(this, false)
    service.setContext({ getRootNode: () => shadow })
    service.start()
  } })
  service.start()
  await settle()
  expect(service.state.value).toBe('ready')
  expect(input.indeterminate).toBe(false)
  expect(replacement.indeterminate).toBe(true)
  expect(writes).toEqual([true])
  expect(newWrite).toHaveBeenCalledTimes(1)
  expect(changes).not.toHaveBeenCalled()
  expect(events).not.toHaveBeenCalled()
})
