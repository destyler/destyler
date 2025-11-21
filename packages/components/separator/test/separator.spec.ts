import { beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Separator'

let mountEl: HTMLElement

const horizontalRoot = () => page.locatoring('[data-separator-horizontal][data-part=root]')
const verticalRoots = () => page.locatoring('[data-separator-vertical][data-part=root]')

describe('[separator] browser tests', () => {
  beforeEach(() => {
    if (mountEl?.isConnected)
      mountEl.remove()

    mountEl = document.createElement('div')
    document.body.appendChild(mountEl)
  })

  it('applies separator semantics to the horizontal rule', async () => {
    render(mountEl)

    const root = horizontalRoot()

    await expect.element(root).toHaveAttribute('role', 'separator')
    await expect.element(root).toHaveAttribute('aria-orientation', 'horizontal')
    await expect.element(root).toHaveAttribute('data-orientation', 'horizontal')
    await expect.element(root).toHaveAttribute('data-scope', 'separator')
  })

  it('supports overriding orientation per call', async () => {
    render(mountEl)

    const vertical = verticalRoots()
    const nodes = vertical.all()
    expect(nodes.length).toBe(2)

    for (const node of nodes) {
      await expect.element(node).toHaveAttribute('role', 'separator')
      await expect.element(node).toHaveAttribute('aria-orientation', 'vertical')
      await expect.element(node).toHaveAttribute('data-orientation', 'vertical')
    }
  })

  it('honors machine orientation when set to vertical', async () => {
    render(mountEl, { id: 'separator:vertical', orientation: 'vertical' })

    const root = horizontalRoot()

    await expect.element(root).toHaveAttribute('aria-orientation', 'vertical')
    await expect.element(root).toHaveAttribute('data-orientation', 'vertical')
  })

  it('passes the writing direction to the DOM', async () => {
    render(mountEl, { id: 'separator:rtl', dir: 'rtl' })

    const root = horizontalRoot()

    await expect.element(root).toHaveAttribute('dir', 'rtl')
  })

  it('allows overriding the root id via ids.root', async () => {
    render(mountEl, { id: 'separator:custom', ids: { root: 'custom-root-id' } })

    const root = horizontalRoot()

    await expect.element(root).toHaveAttribute('id', 'custom-root-id')
  })
})
