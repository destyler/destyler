import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Signature'

let mount: HTMLElement

const POINTER_ID = 1
const defaultStroke = [
  { x: 20, y: 20 },
  { x: 120, y: 60 },
  { x: 240, y: 120 },
]

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

const controlLocator = () => testHook.getControlEl()
const segmentLocator = () => page.getByArticle(testHook.part('segment'))
const clearLocator = () => page.getByArticle(testHook.part('clear-trigger'))
const previewLocator = () => page.getByArticle(testHook.part('preview'))
const pathLocator = () => page.getByArticle(testHook.part('segment-path'))

function controlElement() {
  return controlLocator().element() as HTMLElement
}

function segmentElement() {
  return segmentLocator().element() as SVGSVGElement
}

function clearButton() {
  return clearLocator().element() as HTMLButtonElement
}

function previewElement() {
  return previewLocator().element() as HTMLImageElement
}

function signaturePaths() {
  return pathLocator().elements() as SVGPathElement[]
}

function ensureLayout() {
  const rect = DOMRect.fromRect({ x: 0, y: 0, width: 400, height: 160 })
  controlElement().getBoundingClientRect = () => rect
  segmentElement().getBoundingClientRect = () => rect
}

function firePointerOnControl(type: 'pointerdown' | 'pointerup', point: { x: number, y: number }) {
  const target = controlElement()
  const event = new PointerEvent(type, {
    pointerId: POINTER_ID,
    pointerType: 'mouse',
    bubbles: true,
    buttons: type === 'pointerup' ? 0 : 1,
    button: 0,
    pressure: type === 'pointerup' ? 0 : 0.5,
    clientX: point.x,
    clientY: point.y,
  })
  target.dispatchEvent(event)
}

function firePointerOnDocument(type: 'pointermove' | 'pointerup', point: { x: number, y: number }) {
  const event = new PointerEvent(type, {
    pointerId: POINTER_ID,
    pointerType: 'mouse',
    bubbles: true,
    buttons: type === 'pointerup' ? 0 : 1,
    button: 0,
    pressure: type === 'pointerup' ? 0 : 0.5,
    clientX: point.x,
    clientY: point.y,
  })
  document.dispatchEvent(event)
}

async function performStroke(points = defaultStroke) {
  ensureLayout()
  const [start, ...rest] = points
  firePointerOnControl('pointerdown', start)
  for (const point of rest) {
    firePointerOnDocument('pointermove', point)
  }
  const last = rest.at(-1) ?? start
  firePointerOnDocument('pointerup', last)
  firePointerOnControl('pointerup', last)
  await sleep()
}

async function drawStroke(points = defaultStroke) {
  await performStroke(points)
  await vi.waitFor(() => {
    expect(signaturePaths().length).toBeGreaterThan(0)
  })
}

describe('signature browser tests', () => {
  beforeEach(() => {
    if (mount)
      document.body.removeChild(mount)

    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  it('draws a stroke and shows the exported preview', async () => {
    const clear = clearButton()
    expect(clear.hidden).toBe(true)

    await drawStroke()

    await vi.waitFor(() => {
      expect(clear.hidden).toBe(false)
    })

    const preview = previewElement()
    await vi.waitFor(() => {
      expect(preview.hidden).toBe(false)
      expect(preview.getAttribute('src')).toMatch(/^data:image\/png/)
    })
  })

  it('clears paths, hides preview, and returns focus to the canvas', async () => {
    await drawStroke()

    const control = controlLocator()
    const clear = clearButton()
    await clear.click()

    await vi.waitFor(() => {
      expect(signaturePaths().length).toBe(0)
    })

    await vi.waitFor(() => {
      expect(clear.hidden).toBe(true)
    })

    const preview = previewElement()
    await vi.waitFor(() => {
      expect(preview.hidden).toBe(true)
      expect(preview.getAttribute('src')).toBeNull()
    })

    await vi.waitFor(async () => {
      await expect.element(control).toHaveFocus()
    })
  })

  it('prevents drawing when disabled is toggled on', async () => {
    await page.getByTestId('disabled').click()

    await performStroke()

    await vi.waitFor(() => {
      expect(signaturePaths().length).toBe(0)
    })

    await expect.element(testHook.getControlEl()).toHaveAttribute('data-disabled', '')
  })

  it('prevents additional strokes after readOnly is enabled', async () => {
    await drawStroke()
    const existing = signaturePaths().length

    await page.getByTestId('readOnly').click()

    await performStroke()

    await vi.waitFor(() => {
      expect(signaturePaths().length).toBe(existing)
    })
  })
})
