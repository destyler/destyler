// Native companion: use fixture-owned nodes without changing the original source fixture.
import { describe, expect, it, vi } from 'vitest'
import { flush, panels, setup } from './splitter.native-test-helper'

describe('splitter state contracts', () => {
  it('uses externally synchronized controlled sizes for the next keyboard intent', async () => {
    const onSizeChange = vi.fn()
    const { service } = setup({ size: panels, onSizeChange })
    service.send({ type: 'FOCUS', id: 'a:b' })
    service.send({ type: 'ARROW_RIGHT', step: 1 })
    expect(onSizeChange.mock.calls[0][0].size.map((p: any) => p.size)).toEqual([51, 49])
    expect(service.state.context.size).toEqual(panels)
    service.setContext({ size: [{ id: 'a', size: 70 }, { id: 'b', size: 30 }] })
    await flush()
    service.send({ type: 'ARROW_RIGHT', step: 1 })
    expect(onSizeChange.mock.calls[1][0].size.map((p: any) => p.size)).toEqual([71, 29])
    expect(service.state.context.size!.map(p => p.size)).toEqual([70, 30])
  })

  it('resolves public numeric panel identifiers from trigger identifiers', () => {
    const { service, api } = setup({ defaultSize: [{ id: 0, size: 50 }, { id: 1, size: 50 }] })
    service.send({ type: 'FOCUS', id: '0:1' })
    service.send({ type: 'ARROW_RIGHT', step: 5 })
    expect(service.state.context.size!.map(p => p.size)).toEqual([55, 45])
    expect(api().getResizeTriggerState({ id: '0:1' }).min).toBe(0)
  })

  it('exposes the current separator position rather than a constant zero', () => {
    const { api } = setup({ defaultSize: [{ id: 'a', size: 30 }, { id: 'b', size: 70 }] })
    expect(api().getResizeTriggerProps({ id: 'a:b' })['aria-valuenow']).toBe(30)
  })
})
