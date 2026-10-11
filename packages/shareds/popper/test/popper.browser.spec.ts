import type { ComputePositionReturn, PositioningOptions } from '../index'
import { afterEach, describe, expect, it } from 'vitest'
import { getPlacement, getPlacementStyles } from '../index'

const elements: HTMLElement[] = []
const cleanups: Array<() => void> = []

function box(styles: string, parent: HTMLElement = document.body) {
  const element = document.createElement('div')
  element.style.cssText = `box-sizing: border-box; border: 0; margin: 0; padding: 0; ${styles}`
  parent.append(element)
  elements.push(element)
  return element
}

function start(reference: HTMLElement, floating: HTMLElement, options: PositioningOptions) {
  const updates: ComputePositionReturn[] = []
  const cleanup = getPlacement(reference, floating, {
    ...options,
    onComplete: position => updates.push(position),
  })
  let stopped = false
  const stop = () => {
    if (stopped)
      return
    stopped = true
    cleanup()
  }
  cleanups.push(stop)
  return { updates, stop }
}

async function expectBox(element: HTMLElement, expected: Partial<Pick<DOMRect, 'left' | 'top' | 'width'>>) {
  await expect.poll(() => {
    const actual = element.getBoundingClientRect()
    return Math.max(...Object.entries(expected).map(([key, value]) => Math.abs(actual[key as keyof typeof expected] - value)))
  }).toBeLessThanOrEqual(0.5)
}

async function frames() {
  // Let the already-triggered observer and positioning work finish before
  // testing disposal. This does not require cancellation of in-flight work.
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}

afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup())
  elements.splice(0).forEach(element => element.remove())
})

describe('popper native browser geometry', () => {
  it('positions and sizes against a custom anchor that differs from the element', async () => {
    const reference = box('position: fixed; left: 80px; top: 80px; width: 100px; height: 40px')
    const floating = box('height: 30px')
    Object.assign(floating.style, getPlacementStyles({ placement: 'bottom-start', strategy: 'fixed', sameWidth: true }).floating)

    start(reference, floating, {
      placement: 'bottom-start',
      strategy: 'fixed',
      sameWidth: true,
      listeners: false,
      getAnchorRect: () => ({ x: 320, y: 160, width: 120, height: 24 }),
    })

    await expectBox(reference, { left: 80, top: 80, width: 100 })
    await expectBox(floating, { left: 320, top: 192, width: 120 })
  })

  it('flips and slides inside a real clipping ancestor and follows its scroll', async () => {
    const boundary = box('position: fixed; left: 80px; top: 80px; width: 220px; height: 200px; overflow: hidden')
    const scroller = box('position: relative; width: 100%; height: 100%; overflow: auto', boundary)
    const content = box('position: relative; width: 100%; height: 500px', scroller)
    const reference = box('position: absolute; right: 0; top: 155px; width: 24px; height: 24px', content)
    const floating = box('width: 100px; height: 40px', boundary)
    Object.assign(floating.style, getPlacementStyles({ placement: 'bottom-start' }).floating)
    const tracking = start(reference, floating, {
      placement: 'bottom-start',
      flip: ['top-start'],
      listeners: { ancestorScroll: true, ancestorResize: false, elementResize: false, layoutShift: false },
    })

    const expectClippedPlacement = async () => {
      await expect.poll(() => tracking.updates.at(-1)?.placement).toBe('top-start')
      const clip = boundary.getBoundingClientRect()
      const anchor = reference.getBoundingClientRect()
      await expectBox(floating, {
        left: clip.left + boundary.clientLeft + boundary.clientWidth - 8 - 100,
        top: anchor.top - 8 - 40,
      })
    }

    await expectClippedPlacement()
    await frames()
    const updateCount = tracking.updates.length
    scroller.scrollTop = 24
    await expect.poll(() => tracking.updates.length).toBeGreaterThan(updateCount)
    expect(scroller.scrollTop).toBe(24)
    await expectClippedPlacement()
  })

  it('updates for native resize and layout observers and releases settled tracking', async () => {
    const reference = box('position: fixed; left: 100px; top: 120px; width: 100px; height: 40px')
    const floating = box('width: 80px; height: 30px')
    Object.assign(floating.style, getPlacementStyles({ placement: 'bottom-start', strategy: 'fixed' }).floating)
    const options = { placement: 'bottom-start', strategy: 'fixed' } as const
    const resizing = start(reference, floating, {
      ...options,
      listeners: { ancestorScroll: false, ancestorResize: false, elementResize: true, layoutShift: false },
    })

    await expectBox(floating, { left: 100, top: 168 })
    reference.style.height = '72px'
    await expectBox(floating, { left: 100, top: 200 })
    await frames()
    resizing.stop()
    const resizeCount = resizing.updates.length
    const resizeCoordinates = [floating.style.getPropertyValue('--x'), floating.style.getPropertyValue('--y')]
    reference.style.height = '90px'
    await frames()
    expect(resizing.updates).toHaveLength(resizeCount)
    expect([floating.style.getPropertyValue('--x'), floating.style.getPropertyValue('--y')]).toEqual(resizeCoordinates)
    await expectBox(floating, { left: 100, top: 200 })

    reference.style.height = '72px'
    const moving = start(reference, floating, {
      ...options,
      listeners: { ancestorScroll: false, ancestorResize: false, elementResize: false, layoutShift: true },
    })
    await expectBox(floating, { left: 100, top: 200 })
    await frames()
    reference.style.left = '180px'
    await expectBox(floating, { left: 180, top: 200 })
    await frames()
    moving.stop()
    const moveCount = moving.updates.length
    const moveCoordinates = [floating.style.getPropertyValue('--x'), floating.style.getPropertyValue('--y')]
    reference.style.left = '240px'
    await frames()
    expect(moving.updates).toHaveLength(moveCount)
    expect([floating.style.getPropertyValue('--x'), floating.style.getPropertyValue('--y')]).toEqual(moveCoordinates)
    await expectBox(floating, { left: 180, top: 200 })
  })
})
