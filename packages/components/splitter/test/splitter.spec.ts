import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Splitter'

const scopeSelector = '[data-scope="splitter"]'
const rootSelector = `${scopeSelector}[data-part="root"]`
const resizeSelector = `${scopeSelector}[data-part="resize-trigger"]`
const visualizerSelector = '.viz'

let mount: HTMLElement | null = null

function getRequiredElement<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (!el)
    throw new Error(`Expected element for selector ${selector} to exist`)
  return el
}

function getRootEl() {
  return getRequiredElement<HTMLElement>(rootSelector)
}

function getPanelEl(id: string) {
  return getRequiredElement<HTMLElement>(`[data-panel-id="${id}"]`)
}

function getResizeHandle() {
  return getRequiredElement<HTMLElement>(resizeSelector)
}

function getVisualizerText() {
  return document.querySelector(visualizerSelector)?.textContent ?? ''
}

function getVisualizerState<T = any>(): T | null {
  const text = getVisualizerText()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start)
    return null
  const jsonString = text.slice(start, end + 1)
  try {
    return JSON.parse(jsonString)
  }
  catch {
    return null
  }
}

function getPanelSize(id: string) {
  const viz = getVisualizerState<{ context?: { size?: Array<{ id: string, size: number }> } }>()
  const entry = viz?.context?.size?.find(panel => panel.id === id)
  return typeof entry?.size === 'number' ? entry.size : Number.NaN
}

async function waitForPanelSize(id: string, expected: number, precision = 0) {
  await vi.waitFor(() => {
    expect(getPanelSize(id)).toBeCloseTo(expected, precision)
  })
}

async function focusResizeHandle() {
  const handle = getResizeHandle()
  handle.focus()
  await vi.waitFor(() => {
    expect(document.activeElement).toBe(handle)
  })
  return handle
}

describe('splitter browser tests', () => {
  beforeEach(() => {
    if (mount) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  it('renders panels, handle, and accessible attributes', () => {
    const root = getRootEl()
    const panelA = getPanelEl('a')
    const panelB = getPanelEl('b')
    const handle = getResizeHandle()

    expect(root.dataset.scope).toBe('splitter')
    expect(root.dataset.orientation).toBe('horizontal')
    expect(root.style.flexDirection).toBe('row')

    expect(getPanelSize('a')).toBeCloseTo(50, 0)
    expect(getPanelSize('b')).toBeCloseTo(50, 0)

    const controls = handle.getAttribute('aria-controls')?.split(' ') ?? []
    expect(controls).toContain(panelA.id)
    expect(controls).toContain(panelB.id)
    expect(handle.getAttribute('aria-orientation')).toBe('horizontal')
    expect(handle.getAttribute('role')).toBe('separator')

    expect(getVisualizerText()).toContain('"orientation": "horizontal"')
  })

  it('updates orientation and direction through controls', async () => {
    const root = getRootEl()
    const panel = getPanelEl('a')
    const handle = getResizeHandle()

    await page.getByTestId('orientation').selectOptions('vertical')

    await vi.waitFor(() => {
      expect(root.dataset.orientation).toBe('vertical')
    })

    expect(root.style.flexDirection).toBe('column')
    expect(handle.getAttribute('aria-orientation')).toBe('vertical')

    await page.getByTestId('dir').selectOptions('rtl')

    await vi.waitFor(() => {
      expect(root.getAttribute('dir')).toBe('rtl')
    })

    expect(panel.getAttribute('dir')).toBe('rtl')
    expect(handle.getAttribute('dir')).toBe('rtl')

    await vi.waitFor(() => {
      const viz = getVisualizerText()
      expect(viz).toContain('"orientation": "vertical"')
      expect(viz).toContain('"dir": "rtl"')
    })
  })

  it('resizes panels with arrow keys', async () => {
    await focusResizeHandle()

    await testHook.pressKey('ArrowRight', 5)

    await vi.waitFor(() => {
      expect(getPanelSize('a')).toBeGreaterThan(50)
      expect(getPanelSize('b')).toBeLessThan(50)
    })

    const increased = getPanelSize('a')

    await testHook.pressKey('ArrowLeft', 3)

    await vi.waitFor(() => {
      expect(getPanelSize('a')).toBeLessThan(increased)
    })
  })

  it('clamps panel sizes with home and end', async () => {
    await focusResizeHandle()

    await testHook.pressKey('End')

    await vi.waitFor(() => {
      expect(getPanelSize('a')).toBeCloseTo(100, 0)
      expect(getPanelSize('b')).toBeCloseTo(0, 0)
    })

    await testHook.pressKey('Home')

    await vi.waitFor(() => {
      expect(getPanelSize('a')).toBeCloseTo(0, 0)
      expect(getPanelSize('b')).toBeCloseTo(100, 0)
    })
  })

  it('toggles min/max with enter', async () => {
    await focusResizeHandle()

    await testHook.pressKey('Enter')
    await waitForPanelSize('a', 100)

    await testHook.pressKey('Enter')
    await waitForPanelSize('a', 0)
  })
})
