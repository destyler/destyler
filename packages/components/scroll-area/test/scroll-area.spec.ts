import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
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
  return testHook.getPart('scrollbar').first()
}

function getThumbY() {
  return testHook.getPart('thumb').first()
}

function getRootEl() {
  return testHook.getPart('root').first()
}

function getVirtualItems() {
  return page.locatoring('.virtual-item')
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
})
