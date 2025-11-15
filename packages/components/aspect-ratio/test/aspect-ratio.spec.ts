import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '../examples/vanilla/AspectRatio'

let el: HTMLElement

describe('[aspect ratio] browser tests', () => {
  beforeEach(async () => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  it('renders correctly', async () => {
    render(el, 16 / 9)
    const items = testHook.getPart('root')
    await expect.element(items).toHaveStyle(`
      position: relative; width: 100%; padding-bottom: ${(9 / 16) * 100}%;
    `)
  })
})
