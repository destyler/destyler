import type { PropTypes } from '../../../types/index'
import { expect, it, vi } from 'vitest'
import { connect } from '../../../components/tabs/src/connect'
import { machine } from '../../../components/tabs/src/machine'
import { createNormalizer } from '../../../types/index'
import { createMachine } from '../../../xstate/index'

it('stopping actual Tabs inside a rectangle notification does not leave an endless global loop', () => {
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
  const original = machine({ id: 'rect-stop', defaultValue: 'a' })
  const service = createMachine(original.config, { ...original.options, sync: true })
  const normalize = createNormalizer<PropTypes>(props => props)
  const api = () => connect(service.state, service.send, normalize)
  const root = document.createElement('div')
  const list = document.createElement('div')
  list.id = api().getListProps().id!
  root.append(list)
  const trigger = document.createElement('button')
  const triggerProps = api().getTriggerProps({ value: 'a' })
  trigger.id = triggerProps.id!
  trigger.setAttribute('role', 'tab')
  trigger.setAttribute('data-ownedby', list.id)
  trigger.dataset.value = 'a'
  list.append(trigger)
  const indicator = document.createElement('div')
  indicator.id = api().getIndicatorProps().id!
  root.append(indicator)
  document.body.append(root)
  let width = 0
  Object.defineProperty(trigger, 'offsetWidth', { configurable: true, get: () => width })
  let stopped = false
  let unsubscribe: VoidFunction | undefined
  try {
    service.start()
    tick()
    unsubscribe = service.subscribe((state) => {
      if (stopped || state.context.indicatorState.rect.width !== '41px')
        return
      // Avoid testing the separately owned recursive-stop issue here.
      stopped = true
      service.stop()
    })
    width = 41
    tick()
    expect(stopped).toBe(true)
    // Main Tabs has separate finite nextTick work, addressed by its own draft.
    // Drain those two stages; this test isolates the endless shared observer loop.
    tick()
    tick()
    tick()
    expect(frames.size).toBe(0)
  }
  finally {
    unsubscribe?.()
    service.stop()
    root.remove()
    vi.unstubAllGlobals()
  }
})
