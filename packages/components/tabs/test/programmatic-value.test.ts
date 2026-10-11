// @vitest-environment happy-dom
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(value => value)
const services: ReturnType<typeof machine>[] = []
afterEach(() => services.splice(0).forEach(service => service.stop()))

describe.each([false, true])('deselectable programmatic requests (controlled=%s)', (controlled) => {
  it.each(['', 'a'])('sets a new value while %j is selected and focused', (initial) => {
    const changes: Array<string | null> = []
    const service = machine({
      id: 'programmatic-request',
      ...(controlled ? { value: initial } : { defaultValue: initial }),
      deselectable: true,
      onValueChange: ({ value }) => changes.push(value),
    }).start()
    services.push(service)
    const api = () => connect(service.getState(), service.send, normalize)
    api().setValue('b')
    expect(changes).toEqual(['b'])
    expect(api().value).toBe(controlled ? initial : 'b')
    if (controlled) {
      service.setContext({ value: 'b' })
      expect(api().value).toBe('b')
      expect(changes).toEqual(['b'])
    }
  })

  it('keeps setting the current value idempotent', () => {
    const onValueChange = vi.fn()
    const service = machine({
      id: 'programmatic-idempotence',
      ...(controlled ? { value: '' } : { defaultValue: '' }),
      deselectable: true,
      onValueChange,
    }).start()
    services.push(service)
    const api = () => connect(service.getState(), service.send, normalize)
    api().setValue('')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(api().value).toBe('')
  })
  it('allows immediate acceptance and reentry without toggling the accepted value', () => {
    const calls: Array<string | null> = []
    let service: ReturnType<typeof machine>
    const api = () => connect(service.getState(), service.send, normalize)
    service = machine({
      id: 'programmatic-reentry',
      ...(controlled ? { value: '' } : { defaultValue: '' }),
      deselectable: true,
      onValueChange: ({ value }) => {
        calls.push(value)
        if (controlled)
          service.setContext({ value })
        if (value !== null)
          api().setValue(value)
      },
    }).start()
    services.push(service)
    api().setValue('b')
    expect(api().value).toBe('b')
    expect(calls).toEqual(['b'])
  })
})
