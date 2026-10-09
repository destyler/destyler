import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const services: ReturnType<typeof machine>[] = []
const normalize = createNormalizer(props => props)

afterEach(() => {
  services.splice(0).forEach(service => service.stop())
  document.body.replaceChildren()
})

function setup() {
  const root = document.createElement('form')
  const input = document.createElement('input')
  input.id = 'dynamic:value-notification:hidden-input'
  input.name = 'tags'
  input.hidden = true
  input.value = '["Alpha","Beta","Gamma"]'
  root.append(input)
  document.body.append(root)
  const onValueChange = vi.fn()
  const onInput = vi.fn()
  root.addEventListener('input', onInput)
  const service = machine({ id: 'value-notification', value: ['Alpha', 'Beta', 'Gamma'], onValueChange })
  services.push(service)
  service.start()
  const api = () => connect(service.getState(), service.send, normalize)
  return { service, api, input, root, onValueChange, onInput }
}

describe('dynamic indexed value notifications', () => {
  it('keeps the callback, form value and public array in sync when one tag changes', () => {
    const { api, input, root, onValueChange, onInput } = setup()
    api().setValueAtIndex(1, 'Replaced')
    expect(api().value).toEqual(['Alpha', 'Replaced', 'Gamma'])
    expect(onValueChange.mock.calls).toEqual([[{ value: ['Alpha', 'Replaced', 'Gamma'] }]])
    expect(input.value).toBe('["Alpha","Replaced","Gamma"]')
    expect(new FormData(root).get('tags')).toBe('["Alpha","Replaced","Gamma"]')
    expect(onInput).toHaveBeenCalledTimes(1)
    expect(onInput.mock.calls[0][0].target).toBe(input)
    expect(onInput.mock.calls[0][0].bubbles).toBe(true)
  })

  it('does not notify or dispatch for a same-value indexed write', () => {
    const { api, input, onValueChange, onInput } = setup()
    api().setValueAtIndex(1, 'Beta')
    expect(api().value).toEqual(['Alpha', 'Beta', 'Gamma'])
    expect(input.value).toBe('["Alpha","Beta","Gamma"]')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onInput).not.toHaveBeenCalled()
  })

  it('gives callbacks a detached snapshot and does not let later edits mutate earlier notifications', () => {
    const { api, onValueChange } = setup()
    api().setValueAtIndex(0, 'First')
    api().setValueAtIndex(2, 'Last')
    expect(onValueChange.mock.calls).toEqual([
      [{ value: ['First', 'Beta', 'Gamma'] }],
      [{ value: ['First', 'Beta', 'Last'] }],
    ])
    const first = onValueChange.mock.calls[0][0].value
    first[1] = 'Consumer mutation'
    expect(api().value).toEqual(['First', 'Beta', 'Last'])
  })

  it('retains the existing empty-string rejection without reporting an accepted change', () => {
    const { api, input, onValueChange, onInput } = setup()
    expect(() => api().setValueAtIndex(1, '')).toThrow('You need to provide a value for the tag')
    expect(api().value).toEqual(['Alpha', 'Beta', 'Gamma'])
    expect(input.value).toBe('["Alpha","Beta","Gamma"]')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onInput).not.toHaveBeenCalled()
  })

  it('keeps whole-array replacement and indexed replacement on the same notification contract', () => {
    const { api, input, onValueChange, onInput } = setup()
    api().setValue(['First', 'Second'])
    api().setValueAtIndex(1, 'Third')
    expect(onValueChange.mock.calls).toEqual([
      [{ value: ['First', 'Second'] }],
      [{ value: ['First', 'Third'] }],
    ])
    expect(api().value).toEqual(['First', 'Third'])
    expect(input.value).toBe('["First","Third"]')
    expect(onInput).toHaveBeenCalledTimes(2)
  })
  it('lets a synchronous parent replacement determine the submitted value after the callback', () => {
    const { service, api, input, onValueChange, onInput } = setup()
    onValueChange.mockImplementation(({ value }: { value: string[] }) => {
      expect(api().value).toEqual(value)
      service.setContext({ value: ['Parent accepted'] })
    })
    api().setValueAtIndex(1, 'Requested')
    expect(onValueChange.mock.calls).toEqual([[{ value: ['Alpha', 'Requested', 'Gamma'] }]])
    expect(api().value).toEqual(['Parent accepted'])
    expect(input.value).toBe('["Parent accepted"]')
    expect(onInput).toHaveBeenCalledTimes(1)
  })

  it('retains mutable live-value ownership when the callback does not write back', () => {
    const { service, api, onValueChange } = setup()
    api().setValueAtIndex(1, 'Internal update')
    expect(onValueChange.mock.calls).toEqual([[{ value: ['Alpha', 'Internal update', 'Gamma'] }]])
    expect(api().value).toEqual(['Alpha', 'Internal update', 'Gamma'])
    service.setContext({ value: ['Later parent update'] })
    expect(api().value).toEqual(['Later parent update'])
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })
})
