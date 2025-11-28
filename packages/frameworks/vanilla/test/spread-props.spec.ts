import { describe, expect, it, vi } from 'vitest'
import { hydrateSpreadProps, spreadProps } from '../index'

describe('spreadProps string hydration', () => {
  it('hydrates event handlers on generated markup', () => {
    const root = document.createElement('div')
    const handleClick = vi.fn()

    root.innerHTML = `<button ${spreadProps({ onclick: handleClick })}></button>`

    hydrateSpreadProps(root)

    const button = root.querySelector('button')
    expect(button).toBeTruthy()

    button?.dispatchEvent(new window.Event('click', { bubbles: true }))
    expect(handleClick).toHaveBeenCalled()
  })
})
