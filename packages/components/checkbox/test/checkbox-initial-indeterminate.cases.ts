import type { PropTypes } from '@destyler/types'
import type { UserDefinedContext } from '../src/types'
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

const normalize = createNormalizer<NativeProps>(props => props)
const cleanups: Array<() => void> = []
const settle = () => new Promise<void>(resolve => setTimeout(resolve, 0))

// Apply only connector props, as a consumer does. Never pre-set indeterminate.
function prepare(context: Partial<UserDefinedContext> = {}, mounted = true) {
  const changes = vi.fn()
  const service = machine({ id: 'initial-indeterminate', name: 'flag', onCheckedChange: changes, ...context })
  const form = document.createElement('form')
  const input = document.createElement('input')
  const api = () => connect(service.getState(), service.send, normalize)
  const props = api().getHiddenInputProps()
  Object.assign(input, {
    id: props.id,
    type: props.type,
    name: props.name,
    value: props.value,
    defaultChecked: props.defaultChecked,
  })
  input.addEventListener('click', props.onClick)
  const events = vi.fn()
  for (const name of ['click', 'input', 'change'])
    input.addEventListener(name, events)
  form.append(input)
  if (mounted)
    document.body.append(form)
  cleanups.push(() => {
    service.stop()
    form.remove()
  })
  return { service, input, form, api, changes, events }
}

// Exercise the runtime's partial init-context merge without changing StateInit's public type.
function startWithContext(service: ReturnType<typeof machine>, context: Partial<typeof service.state.context>) {
  service.start({ value: 'ready', context: context as typeof service.state.context })
}

afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse())
    cleanup()
  vi.restoreAllMocks()
})

// Keep diagnostic #199's original assertion trio, without its pre-synchronizing
// #205 fixture or requiring an API event to make the checked watcher run.
it('checkbox initializes the native indeterminate property from its default', () => {
  const { service, input } = prepare({ defaultChecked: 'indeterminate' })
  service.start()
  expect(service.state.context.checked).toBe('indeterminate')
  expect(input.indeterminate).toBe(true)
  expect(input.checked).toBe(false)
})

for (const field of ['defaultChecked', 'checked'] as const) {
  for (const initial of [false, true, 'indeterminate'] as const) {
    it(`${field}=${initial}: initializes mounted native state synchronously without events or proposals`, async () => {
      const { service, input, form, api, changes, events } = prepare({ [field]: initial })
      const checked = vi.spyOn(HTMLInputElement.prototype, 'checked', 'set')
      const defaultChecked = vi.spyOn(HTMLInputElement.prototype, 'defaultChecked', 'set')
      expect(input.indeterminate).toBe(false)
      service.start()
      expect(service.state.context.checked).toBe(initial)
      expect(input.indeterminate).toBe(initial === 'indeterminate')
      expect(input.checked).toBe(initial === true)
      expect(input.defaultChecked).toBe(initial === true)
      expect(api().indeterminate).toBe(initial === 'indeterminate')
      expect(new FormData(form).get('flag')).toBe(initial === true ? 'on' : null)
      await settle()
      expect(checked).not.toHaveBeenCalled()
      expect(defaultChecked).not.toHaveBeenCalled()
      expect(changes).not.toHaveBeenCalled()
      expect(events).not.toHaveBeenCalled()
    })
  }
}

it.each([false, true, 'indeterminate'] as const)('checked=%s with a conflicting default preserves the existing default-first resolution', (checked) => {
  const defaultChecked = checked === 'indeterminate' ? true : 'indeterminate'
  const { service, input, changes } = prepare({ checked, defaultChecked })
  service.start()
  expect(service.state.context.checked).toBe(defaultChecked)
  expect(input.indeterminate).toBe(defaultChecked === 'indeterminate')
  expect(changes).not.toHaveBeenCalled()
})

it('explicit undefined stays presence-controlled and initializes the resolved default', async () => {
  const { service, input, api, changes } = prepare({ checked: undefined, defaultChecked: 'indeterminate' })
  service.start()
  expect(input.indeterminate).toBe(true)
  api().setChecked(true)
  await settle()
  expect(service.state.context.checked).toBe('indeterminate')
  expect(input.indeterminate).toBe(true)
  expect(changes.mock.calls).toEqual([[{ checked: true }]])
})

it.each([false, true, 'indeterminate'] as const)('start context checked=%s is applied before native initialization', async (checked) => {
  const initial = checked === 'indeterminate' ? false : 'indeterminate'
  const { service, input, changes, events } = prepare({ defaultChecked: initial })
  startWithContext(service, { checked })
  expect(service.state.context.checked).toBe(checked)
  expect(input.indeterminate).toBe(checked === 'indeterminate')
  await settle()
  expect(input.checked).toBe(checked === true)
  expect(input.indeterminate).toBe(checked === 'indeterminate')
  expect(changes).not.toHaveBeenCalled()
  expect(events).not.toHaveBeenCalled()
})

it('ready entry leaves checked/defaultChecked alone while the existing changed-value watcher stays asynchronous', async () => {
  const { service, input } = prepare({ defaultChecked: true })
  const checked = vi.spyOn(HTMLInputElement.prototype, 'checked', 'set')
  const defaultChecked = vi.spyOn(HTMLInputElement.prototype, 'defaultChecked', 'set')
  startWithContext(service, { checked: 'indeterminate' })
  expect(input.indeterminate).toBe(true)
  expect(input.checked).toBe(true)
  expect(checked).not.toHaveBeenCalled()
  expect(defaultChecked).not.toHaveBeenCalled()
  await settle()
  expect(input.checked).toBe(false)
  // The existing watcher also updates the checked attribute through setElementChecked.
  expect(input.defaultChecked).toBe(false)
  expect(defaultChecked).not.toHaveBeenCalled()
})

it('explicit ready startup initializes from the latest pre-start context', () => {
  const { service, input, changes } = prepare()
  service.setContext({ checked: 'indeterminate' })
  service.start({ value: 'ready' })
  expect(input.indeterminate).toBe(true)
  expect(changes).not.toHaveBeenCalled()
})

it('repeated start while running neither re-enters nor consumes a new initial context', () => {
  const { service, input } = prepare({ defaultChecked: 'indeterminate' })
  service.start()
  input.indeterminate = false
  startWithContext(service, { checked: true })
  expect(input.indeterminate).toBe(false)
  expect(service.state.context.checked).toBe('indeterminate')
})

it('restart initializes the mounted replacement from current state without replaying callbacks', async () => {
  const { service, input, form, changes, events } = prepare()
  service.start()
  service.setContext({ checked: 'indeterminate' })
  await settle()
  service.stop()
  input.remove()
  const replacement = input.cloneNode() as HTMLInputElement
  form.append(replacement)
  expect(replacement.indeterminate).toBe(false)
  service.start()
  expect(replacement.indeterminate).toBe(true)
  expect(service.initialContext.checked).toBe(false)
  expect(changes).not.toHaveBeenCalled()
  expect(events).not.toHaveBeenCalled()
})

it('restart clears stale indeterminacy when the accepted state changed while stopped', () => {
  const { service, input } = prepare({ defaultChecked: 'indeterminate' })
  service.start()
  service.stop()
  service.setContext({ checked: false })
  service.start()
  expect(input.indeterminate).toBe(false)
})

it('a stopped run has no deferred initialization work', async () => {
  const { service, input, events, changes } = prepare({ defaultChecked: 'indeterminate' })
  service.start()
  service.stop()
  input.indeterminate = false
  await settle()
  expect(input.indeterminate).toBe(false)
  expect(events).not.toHaveBeenCalled()
  expect(changes).not.toHaveBeenCalled()
})

it('absent input is safe; later mounting needs a new entry or existing value synchronization', async () => {
  const { service, input, form } = prepare({ defaultChecked: 'indeterminate' }, false)
  service.start()
  document.body.append(form)
  await settle()
  expect(input.indeterminate).toBe(false)
  service.stop()
  service.start()
  expect(input.indeterminate).toBe(true)
})

it('custom input IDs and a shadow-root scope initialize only the owned input', () => {
  const { service, input, form } = prepare({ defaultChecked: 'indeterminate', ids: { hiddenInput: 'scoped-input' } }, false)
  const host = document.createElement('div')
  const shadow = host.attachShadow({ mode: 'open' })
  const decoy = input.cloneNode() as HTMLInputElement
  document.body.append(host, decoy)
  shadow.append(form)
  cleanups.push(() => {
    host.remove()
    decoy.remove()
  })
  service.setContext({ getRootNode: () => shadow })
  service.start()
  expect(input.indeterminate).toBe(true)
  expect(decoy.indeterminate).toBe(false)
})

for (const mode of ['uncontrolled', 'accept', 'veto'] as const) {
  it(`${mode}: initialization preserves subsequent change ownership and a single proposal`, async () => {
    const { service, input, changes, api } = prepare(mode === 'uncontrolled'
      ? { defaultChecked: 'indeterminate' }
      : { checked: 'indeterminate' })
    if (mode === 'accept')
      changes.mockImplementation(({ checked }) => service.setContext({ checked }))
    service.start()
    expect(input.indeterminate).toBe(true)
    api().setChecked(true)
    await settle()
    expect(service.state.context.checked).toBe(mode === 'veto' ? 'indeterminate' : true)
    expect(input.indeterminate).toBe(mode === 'veto')
    expect(input.checked).toBe(mode !== 'veto')
    expect(changes.mock.calls).toEqual([[{ checked: true }]])
  })
}

it.each(['activity', 'root entry', 'ready activity'] as const)('stop in %s prevents ready initialization, then a clean restart initializes once', (phase) => {
  const { service, input } = prepare({ defaultChecked: 'indeterminate' })
  let interrupt = true
  const stopOnce = () => {
    if (interrupt) {
      interrupt = false
      service.stop()
    }
  }
  if (phase === 'activity')
    service.config.activities = [stopOnce]
  else if (phase === 'root entry')
    service.config.entry = stopOnce
  else
    service.config.states!.ready!.activities = [stopOnce]
  const write = vi.spyOn(input, 'indeterminate', 'set')
  service.start()
  expect(input.indeterminate).toBe(false)
  expect(write).not.toHaveBeenCalled()
  service.start()
  expect(input.indeterminate).toBe(true)
  expect(write).toHaveBeenCalledTimes(1)
})

it('a reentrant start from a root activity does not duplicate ready initialization', () => {
  const { service, input } = prepare({ defaultChecked: 'indeterminate' })
  service.config.activities = [() => {
    startWithContext(service, { checked: false })
  }]
  const write = vi.spyOn(input, 'indeterminate', 'set')
  service.start()
  expect(input.indeterminate).toBe(true)
  expect(service.state.context.checked).toBe('indeterminate')
  expect(write).toHaveBeenCalledTimes(1)
})

it('stop/restart inside a root activity initializes only the new run with its context', () => {
  const { service, input } = prepare({ defaultChecked: false })
  let restart = true
  service.config.activities = [() => {
    if (restart) {
      restart = false
      service.stop()
      startWithContext(service, { checked: 'indeterminate' })
    }
  }]
  const write = vi.spyOn(input, 'indeterminate', 'set')
  service.start()
  expect(input.indeterminate).toBe(true)
  expect(service.state.context.checked).toBe('indeterminate')
  expect(write).toHaveBeenCalledTimes(1)
})

it('stop inside the initial input lookup preserves the caller-owned native property', async () => {
  const { service, input, changes, events } = prepare({ defaultChecked: 'indeterminate' })
  service.config.activities = []
  service.setContext({
    getRootNode: () => {
      service.stop()
      input.indeterminate = false
      return document
    },
  })
  service.start()
  expect(service.state.value).toBe('')
  expect(input.indeterminate).toBe(false)
  await settle()
  expect(input.indeterminate).toBe(false)
  expect(changes).not.toHaveBeenCalled()
  expect(events).not.toHaveBeenCalled()
})

it('stop/restart inside the initial lookup initializes the new root without writing to the old root', async () => {
  const { service, input, changes, events } = prepare({ defaultChecked: 'indeterminate' })
  service.config.activities = []
  const host = document.createElement('div')
  const shadow = host.attachShadow({ mode: 'open' })
  const replacement = input.cloneNode() as HTMLInputElement
  shadow.append(replacement)
  document.body.append(host)
  cleanups.push(() => host.remove())
  service.setContext({
    getRootNode: () => {
      service.stop()
      service.setContext({ getRootNode: () => shadow })
      service.start()
      input.indeterminate = false
      return document
    },
  })
  service.start()
  expect(service.state.value).toBe('ready')
  expect(replacement.indeterminate).toBe(true)
  expect(input.indeterminate).toBe(false)
  await settle()
  expect(input.indeterminate).toBe(false)
  expect(changes).not.toHaveBeenCalled()
  expect(events).not.toHaveBeenCalled()
})

it('a newer event inside the initial lookup retains its native write and existing value watcher', async () => {
  const { service, input, changes, events } = prepare({ defaultChecked: 'indeterminate' })
  service.config.activities = []
  let interrupt = true
  service.setContext({
    getRootNode: () => {
      if (interrupt) {
        interrupt = false
        service.send({ type: 'CONTEXT.SET', context: { checked: false } })
        input.indeterminate = true
      }
      return document
    },
  })
  service.start()
  expect(service.state.context.checked).toBe(false)
  expect(input.indeterminate).toBe(true)
  await settle()
  expect(input.indeterminate).toBe(false)
  expect(changes).not.toHaveBeenCalled()
  expect(events).not.toHaveBeenCalled()
})
