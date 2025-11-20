import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Image'

let mount: HTMLElement | null = null

describe('image browser tests', () => {
  beforeEach(() => {
    if (mount) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  it('should render correctly', async () => {
    const el = page.getByArticle(testHook.part('image'))
    await testHook.waitFor()
    await expect.element(el).toBeVisible()
  })
})
