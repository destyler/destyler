// @vitest-environment happy-dom
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))
const normalize = createNormalizer(props => props)

function setup(ids?: { root?: string }) {
  const service = machine({ id: 'field-label', ids, dir: 'rtl' })
  service.start()
  cleanups.push(() => service.stop())
  return { service, api: () => connect(service.getState(), service.send, normalize) }
}

describe('label structural contracts', () => {
  it('exposes an explicit root ID for aria-labelledby consumers without inventing a default ID', () => {
    const { service, api } = setup({ root: 'account-name-label' })
    const label = document.createElement('label')
    const input = document.createElement('input')
    label.textContent = 'Account name'
    input.setAttribute('aria-labelledby', 'account-name-label')
    label.id = api().getRootProps().id ?? ''
    document.body.append(label, input)
    cleanups.push(() => {
      label.remove()
      input.remove()
    })
    expect(document.getElementById(input.getAttribute('aria-labelledby')!)).toBe(label)
    service.setContext({ ids: { root: 'next-label' } })
    expect(api().getRootProps().id).toBe('next-label')
    expect(setup().api().getRootProps().id).toBeUndefined()
  })

  it('keeps native association props available to callers and preserves direction and selection styles', () => {
    const { api } = setup({ root: 'machine-label' })
    const props = { ...api().getRootProps(), id: 'caller-label', htmlFor: 'field' }
    expect(props).toMatchObject({ 'id': 'caller-label', 'htmlFor': 'field', 'dir': 'rtl', 'data-scope': 'label', 'data-part': 'root' })
    expect(api().getRootProps().style).toEqual({ userSelect: 'none', WebkitUserSelect: 'none' })
  })

  it('reflects repeated enter and leave transitions through the API', () => {
    const { api } = setup()
    expect(api().isHovered).toBe(false)
    api().getRootProps().onMouseEnter?.({})
    api().getRootProps().onMouseEnter?.({})
    expect(api().isHovered).toBe(true)
    api().getRootProps().onMouseLeave?.({})
    api().getRootProps().onMouseLeave?.({})
    expect(api().isHovered).toBe(false)
  })
})
