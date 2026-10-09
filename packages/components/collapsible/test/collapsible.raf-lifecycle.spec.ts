import type { UserDefinedContext } from '../src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { machine } from '../src/machine'

const services: Array<ReturnType<typeof machine>> = []
const nodes: HTMLElement[] = []
let frames: Map<number, FrameRequestCallback>
let nextId: number

beforeEach(() => {
  frames = new Map()
  nextId = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++nextId, callback)
    return nextId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    frames.delete(id)
  })
})

afterEach(() => {
  services.splice(0).forEach(service => service.stop())
  nodes.splice(0).forEach(node => node.remove())
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function tick() {
  const current = [...frames]
  for (const [id, callback] of current) {
    if (!frames.delete(id))
      continue
    callback(0)
  }
}

function setup(context: Partial<UserDefinedContext> = {}) {
  const content = document.createElement('div')
  const id = context.id ?? 'raf-lifecycle'
  content.id = `collapsible:${id}:content`
  content.hidden = true
  content.style.animationName = 'none'
  content.style.animationDuration = '0.4s'
  document.body.append(content)
  nodes.push(content)
  const measure = vi.spyOn(content, 'getBoundingClientRect').mockReturnValue({ height: 40, width: 80 } as DOMRect)
  const service = machine({ id, ...context })
  services.push(service)
  service.start()
  return { service, content, measure }
}

describe('collapsible frame ownership', () => {
  it('does not measure or mutate content after stop cancels a pending open', () => {
    const { service, content, measure } = setup()
    service.send('OPEN')
    service.stop()
    const style = content.getAttribute('style')
    const context = { height: service.state.context.height, width: service.state.context.width, initial: service.state.context.initial }
    tick()
    tick()
    expect(measure).not.toHaveBeenCalled()
    expect(content.getAttribute('style')).toBe(style)
    expect(content.hidden).toBe(true)
    expect({ height: service.state.context.height, width: service.state.context.width, initial: service.state.context.initial }).toEqual(context)
  })

  it('does not keep a deferred clear-initial frame after stop', () => {
    const { service } = setup()
    service.send('OPEN')
    tick()
    expect(frames.size).toBeGreaterThan(0)
    service.stop()
    expect(frames.size).toBe(0)
  })

  it('does not leave a pending frame after stopping an initially closed machine', () => {
    const { service } = setup()
    expect(frames.size).toBe(0)
    service.stop()
    expect(frames.size).toBe(0)
  })

  it('still measures live content and completes its no-animation entry', () => {
    const { service, measure } = setup()
    service.send('OPEN')
    tick()
    tick()
    expect(measure).toHaveBeenCalledTimes(1)
    expect(service.state.context.height).toBe(40)
    expect(service.state.context.width).toBe(80)
    expect(service.state.context.initial).toBe(false)
    expect(service.state.matches('open')).toBe(true)
  })

  it('restarts without running frames from the previous lifetime', () => {
    const { service, measure } = setup()
    service.send('OPEN')
    service.stop()
    service.start()
    tick()
    expect(measure).not.toHaveBeenCalled()
    expect(service.state.matches('closed')).toBe(true)
    expect(service.state.context.initial).toBe(false)
    service.send('OPEN')
    tick()
    tick()
    expect(measure).toHaveBeenCalledTimes(1)
    expect(service.state.context.height).toBe(40)
  })

  it('does not cancel another instance\'s pending work', () => {
    const first = setup({ id: 'first' })
    const second = setup({ id: 'second' })
    first.service.send('OPEN')
    second.service.send('OPEN')
    first.service.stop()
    tick()
    tick()
    expect(first.measure).not.toHaveBeenCalled()
    expect(second.measure).toHaveBeenCalledTimes(1)
    expect(second.service.state.context.height).toBe(40)
    expect(second.service.state.matches('open')).toBe(true)
  })

  it('cancels frames after a controlled parent accepts opening', async () => {
    const onOpenChange = vi.fn()
    const { service, measure } = setup({ open: false, onOpenChange })
    service.send('OPEN')
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith({ open: true })
    expect(frames.size).toBe(0)
    service.setContext({ open: true })
    await Promise.resolve()
    expect(service.state.matches('open')).toBe(true)
    service.stop()
    tick()
    expect(measure).not.toHaveBeenCalled()
  })

  it('removes existing animation listeners and does not call exit completion after stop', () => {
    const onExitComplete = vi.fn()
    const { service, content } = setup({ onExitComplete })
    content.style.animationName = 'expand'
    service.send('OPEN')
    tick()
    service.send('CLOSE')
    content.style.animationName = 'collapse'
    tick()
    service.stop()
    content.dispatchEvent(new AnimationEvent('animationend', { animationName: 'collapse', bubbles: true }))
    tick()
    expect(onExitComplete).not.toHaveBeenCalled()
  })

  it('still completes a live close exactly once without an animation', () => {
    const onExitComplete = vi.fn()
    const { service } = setup({ onExitComplete })
    service.send('OPEN')
    tick()
    tick()
    service.send('CLOSE')
    tick()
    tick()
    expect(service.state.matches('closed')).toBe(true)
    expect(onExitComplete).toHaveBeenCalledTimes(1)
    expect(service.state.context.initial).toBe(false)
  })
})
