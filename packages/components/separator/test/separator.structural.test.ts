import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))
const normalize = createNormalizer(props => props)

describe('separator structural contracts', () => {
  it('defaults to horizontal and updates orientation, direction and custom ID together', () => {
    const service = machine({ id: 'rule' })
    service.start()
    cleanups.push(() => service.stop())
    const api = () => connect(service.getState(), service.send, normalize)
    expect(api().isVertical).toBe(false)
    expect(api().getRootProps()).toMatchObject({ 'id': 'separator:rule', 'role': 'separator', 'aria-orientation': 'horizontal', 'data-orientation': 'horizontal' })
    service.setContext({ orientation: 'vertical', dir: 'rtl', ids: { root: 'custom-rule' } })
    expect(api().isVertical).toBe(true)
    expect(api().getRootProps()).toMatchObject({ 'id': 'custom-rule', 'dir': 'rtl', 'role': 'separator', 'aria-orientation': 'vertical', 'data-orientation': 'vertical' })
    expect(api().getRootProps('horizontal')).toMatchObject({ 'aria-orientation': 'horizontal', 'data-orientation': 'horizontal' })
    expect(api().isVertical).toBe(true)
  })
})
