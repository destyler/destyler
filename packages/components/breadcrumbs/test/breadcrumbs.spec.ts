import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '../examples/vanilla/Breadcrumbs'

let el: HTMLElement

describe('[breadcrumbs] browser tests', () => {
  beforeEach(() => {
    if (el)
      document.body.removeChild(el)
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('applies navigation semantics to the root structure', async () => {
    const root = testHook.getPart('root')
    const list = testHook.getPart('list')

    await expect.element(root).toHaveAttribute('role', 'navigation')
    await expect.element(root).toHaveAttribute('aria-label', 'breadcrumbs')
    await expect.element(list).toHaveAttribute('role', 'list')
  })

  it('marks the current breadcrumb and hides separators from assistive tech', async () => {
    const linkLocator = testHook.getPart('link')
    const separatorLocator = testHook.getPart('separator')

    const links = linkLocator.all()
    const separators = separatorLocator.all()

    expect(links.length).toBe(3)
    expect(separators.length).toBe(2)

    await expect.element(linkLocator.nth(0)).toHaveAttribute('href', '/')
    await expect.element(linkLocator.nth(1)).toHaveAttribute('href', '/products')

    const current = linkLocator.nth(2)
    await expect.element(current).toHaveAttribute('aria-current', 'page')
    await expect.element(current).toHaveAttribute('data-current', 'page')
    await expect.element(current).not.toHaveAttribute('href')

    for (let index = 0; index < separators.length; index++) {
      await expect.element(separatorLocator.nth(index)).toHaveAttribute('aria-hidden', 'true')
    }
  })
})
