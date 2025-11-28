import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Label'

let el: HTMLElement

type RenderOptions = NonNullable<Parameters<typeof render>[1]>
type RenderContext = RenderOptions['context']

function mount(context?: RenderContext) {
  if (el)
    document.body.removeChild(el)

  el = document.createElement('div')
  document.body.appendChild(el)
  render(el, { context })
}

describe('[label] browser tests', () => {
  beforeEach(() => {
    mount()
  })

  it('applies anatomy attributes and prevents text selection', async () => {
    const root = testHook.getPart('root')

    await expect.element(root).toHaveAttribute('data-scope', 'label')
    await expect.element(root).toHaveAttribute('data-part', 'root')
    await expect.element(root).not.toHaveAttribute('dir')

    await expect.element(root).toHaveStyle('user-select: none;')
  })

  it('toggles hovered state when the pointer enters and leaves the label', async () => {
    const root = testHook.getPart('root')
    const indicator = page.getByTestId('hover-indicator')

    await expect.element(indicator).toHaveTextContent('idle')

    await root.hover()
    await expect.element(indicator).toHaveTextContent('hovered')

    await page.getByRole('main').hover()
    await expect.element(indicator).toHaveTextContent('idle')
  })

  it('keeps nested controls focusable while preserving hover state', async () => {
    const indicator = page.getByTestId('hover-indicator')
    const nestedInput = page.getByTestId('nested-input')

    await nestedInput.click()

    await expect.element(nestedInput).toHaveFocus()
    await expect.element(indicator).toHaveTextContent('hovered')
  })

  it('applies explicit direction when provided via context', async () => {
    mount({ dir: 'rtl' })

    const root = testHook.getPart('root')
    await expect.element(root).toHaveAttribute('dir', 'rtl')
  })
})
