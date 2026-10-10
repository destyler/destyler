import type { PropTypes } from '@destyler/types'
import { trackElementRect } from '@destyler/element-rect'
import { createNormalizer } from '@destyler/types'
import { expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

it('an unrelated rectangle observer cannot replace actual Tabs indicator measurements', () => {
  const frames = new Map<number, FrameRequestCallback>()
  let nextId = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++nextId, callback)
    return nextId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    frames.delete(id)
  })
  const tick = () => {
    for (const [id, callback] of [...frames]) {
      if (frames.delete(id))
        callback(0)
    }
  }
  const service = machine({ id: 'rect-options', defaultValue: 'a' })
  const normalize = createNormalizer<PropTypes>(props => props)
  const api = () => connect(service.state, service.send, normalize)
  const root = document.createElement('div')
  root.id = api().getRootProps().id!
  const list = document.createElement('div')
  list.id = api().getListProps().id!
  root.append(list)
  const trigger = document.createElement('button')
  trigger.id = api().getTriggerProps({ value: 'a' }).id!
  trigger.setAttribute('role', 'tab')
  trigger.setAttribute('data-ownedby', list.id)
  trigger.dataset.value = 'a'
  for (const [key, value] of Object.entries({ offsetWidth: 80, offsetHeight: 30, offsetLeft: 5, offsetTop: 7 }))
    Object.defineProperty(trigger, key, { configurable: true, value })
  list.append(trigger)
  const indicator = document.createElement('div')
  indicator.id = api().getIndicatorProps().id!
  root.append(indicator)
  const outside = document.createElement('div')
  document.body.append(root, outside)
  const getOutsideRect = vi.fn(() => ({ top: 100, left: 100, width: 999, height: 999 }))
  const stopOutside = trackElementRect(outside, { getRect: getOutsideRect, onChange: vi.fn() })
  try {
    service.start()
    tick()
    expect(getOutsideRect).toHaveBeenCalledExactlyOnceWith(outside)
    expect(service.state.context.indicatorState.rect).toEqual({ left: '5px', top: '7px', width: '80px', height: '30px' })
    expect(api().value).toBe('a')
  }
  finally {
    service.stop()
    stopOutside()
    root.remove()
    outside.remove()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  }
})
