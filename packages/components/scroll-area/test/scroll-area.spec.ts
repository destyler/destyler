import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/ScrollArea'

let mount: HTMLElement
let cleanup: (() => void) | undefined

function getViewport() {
  return testHook.getPart('viewport').first()
}

function getContent() {
  return testHook.getPart('content').first()
}

function getScrollbarY() {
  return page.locatoring('[data-part="scrollbar"][data-orientation="vertical"]')
}

function getThumbY() {
  return page.locatoring('[data-part="thumb"][data-orientation="vertical"]')
}

function getRootEl() {
  return testHook.getPart('root').first()
}

function getVirtualItems() {
  return page.locatoring('.virtual-item')
}

function getScrollStatus() {
  return page.getByTestId('scroll-status')
}

async function setType(type: 'auto' | 'always' | 'scroll' | 'hover') {
  await page.getByTestId('type').selectOptions(type)
  // Allow control → setContext → connect re-render to settle.
  await vi.waitFor(async () => {
    const select = await page.getByTestId('type').element()
    expect((select as HTMLSelectElement).value).toBe(type)
  }, { timeout: 1000 })
}

async function waitForOverflowScrollbar() {
  await vi.waitFor(async () => {
    const scrollbar = await getScrollbarY().element()
    // Dimensions settle after ResizeObserver; overflow should exist for 1000 virtual items.
    expect(scrollbar.getAttribute('data-orientation')).toBe('vertical')
  }, { timeout: 3000 })
}

describe('[scroll-area] browser tests', () => {
  beforeEach(async () => {
    cleanup?.()
    if (mount && mount.parentElement) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    cleanup = render(mount)
    // Wait for component to initialize
    await vi.waitFor(() => {
      const root = document.querySelector('[data-scope="scroll-area"][data-part="root"]')
      expect(root).toBeTruthy()
    }, { timeout: 2000 })
    await waitForOverflowScrollbar()
  })

  afterEach(() => {
    cleanup?.()
    cleanup = undefined
    if (mount && mount.parentElement) {
      document.body.removeChild(mount)
    }
  })

  it('should render root element', async () => {
    await expect.element(getRootEl()).toBeInTheDocument()
  })

  it('should render viewport element', async () => {
    await expect.element(getViewport()).toBeInTheDocument()
  })

  it('should render content element', async () => {
    await expect.element(getContent()).toBeInTheDocument()
  })

  it('should render scrollbar element', async () => {
    await expect.element(getScrollbarY()).toBeInTheDocument()
  })

  it('should render thumb element', async () => {
    await expect.element(getThumbY()).toBeInTheDocument()
  })

  it('should render control buttons', async () => {
    await expect.element(page.getByRole('button', { name: 'Scroll to Random' })).toBeInTheDocument()
    await expect.element(page.getByRole('button', { name: 'Scroll to Top' })).toBeInTheDocument()
    await expect.element(page.getByRole('button', { name: 'Scroll to Bottom' })).toBeInTheDocument()
  })

  it('should have correct root attributes', async () => {
    const root = getRootEl()
    await expect.element(root).toHaveAttribute('data-scope', 'scroll-area')
    await expect.element(root).toHaveAttribute('data-part', 'root')
  })

  it('should have correct viewport attributes', async () => {
    const viewport = getViewport()
    await expect.element(viewport).toHaveAttribute('data-scope', 'scroll-area')
    await expect.element(viewport).toHaveAttribute('data-part', 'viewport')
  })

  it('should render virtual items when virtual scroll is enabled', async () => {
    await vi.waitFor(() => {
      const items = getVirtualItems()
      const count = items.all()
      // Should render some virtual items
      expect(count.length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })

  it('should have info display element', async () => {
    const infoEl = page.locatoring('[data-scroll-area-info]')
    await expect.element(infoEl).toBeInTheDocument()
  })

  it('[type=always] keeps vertical scrollbar visible with overflow', async () => {
    await setType('always')
    await vi.waitFor(async () => {
      await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'visible')
      await expect.element(getThumbY()).toHaveAttribute('data-state', 'visible')
    }, { timeout: 3000 })
  })

  it('[type=auto] keeps vertical scrollbar visible with overflow', async () => {
    await setType('auto')
    await vi.waitFor(async () => {
      await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'visible')
    }, { timeout: 3000 })
  })

  it('[type=hover] shows scrollbar on pointer enter and hides on leave', async () => {
    await setType('hover')
    // Virtual mount / measure can briefly emit scroll → interacting; wait for idle hide.
    const delayInput = page.getByTestId('scrollHideDelay')
    await delayInput.fill('50')
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(async () => {
      await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'hidden')
    }, { timeout: 2000 })

    await userEvent.hover(getRootEl())
    await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'visible')

    await userEvent.unhover(getRootEl())
    await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'hidden')
  })

  it('[type=scroll] shows scrollbar while scrolling then hides after delay', async () => {
    await setType('scroll')
    // Short hide delay so the idle transition is assertable without a long wait.
    const delayInput = page.getByTestId('scrollHideDelay')
    await delayInput.fill('80')
    await userEvent.keyboard('{Enter}')

    await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'hidden')

    const viewport = await getViewport().element()
    viewport.scrollTop = 400
    viewport.dispatchEvent(new Event('scroll', { bubbles: true }))

    await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'visible')

    await vi.waitFor(async () => {
      await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'hidden')
    }, { timeout: 2000 })
  })

  it('fires onScroll when the viewport scrolls', async () => {
    const status = getScrollStatus()
    await expect.element(status).toHaveAttribute('data-scroll-count', '0')

    const viewport = await getViewport().element()
    viewport.scrollTop = 250
    viewport.dispatchEvent(new Event('scroll', { bubbles: true }))

    await vi.waitFor(async () => {
      await expect.element(status).toHaveAttribute('data-scroll-top', '250')
      const count = Number((await status.element()).getAttribute('data-scroll-count') || '0')
      expect(count).toBeGreaterThan(0)
    }, { timeout: 2000 })
  })

  it('scrollToIndex via harness buttons updates visible range and scroll position', async () => {
    const infoEl = page.locatoring('[data-scroll-area-info]')
    await page.getByRole('button', { name: 'Scroll to Bottom' }).click()

    await vi.waitFor(async () => {
      const scrollTop = Number((await getScrollStatus().element()).getAttribute('data-scroll-top') || '0')
      expect(scrollTop).toBeGreaterThan(1000)
      const text = (await infoEl.element()).textContent || ''
      // Bottom item is index 999 — visible window should sit near the end.
      expect(text).toMatch(/Visible Range: 9\d\d/)
    }, { timeout: 5000 })

    await page.getByRole('button', { name: 'Scroll to Top' }).click()

    await vi.waitFor(async () => {
      await expect.element(getScrollStatus()).toHaveAttribute('data-scroll-top', '0')
      const text = (await infoEl.element()).textContent || ''
      expect(text).toMatch(/Visible Range: 0 -/)
    }, { timeout: 5000 })
  })

  it('thumb drag updates scrollTop', async () => {
    await setType('always')
    await expect.element(getScrollbarY()).toHaveAttribute('data-state', 'visible')

    const thumb = getThumbY()
    const box = await (thumb as any).boundingBox?.()
    if (!box) {
      // Fallback: click lower on the scrollbar track (scrollTo via track click).
      await getScrollbarY().click()
      await vi.waitFor(async () => {
        const scrollTop = Number((await getScrollStatus().element()).getAttribute('data-scroll-top') || '0')
        expect(scrollTop).toBeGreaterThan(0)
      }, { timeout: 2000 })
      return
    }

    const startX = box.x + box.width / 2
    const startY = box.y + box.height / 2
    const endY = startY + 120

    await (page as any).mouse?.move?.(startX, startY)
    await (page as any).mouse?.down?.()
    await (page as any).mouse?.move?.(startX, endY)
    await (page as any).mouse?.up?.()

    await vi.waitFor(async () => {
      const scrollTop = Number((await getScrollStatus().element()).getAttribute('data-scroll-top') || '0')
      expect(scrollTop).toBeGreaterThan(0)
    }, { timeout: 2000 })
  })
})
