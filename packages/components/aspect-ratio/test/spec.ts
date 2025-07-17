import { part } from '@destyler/shared-private/test'
import { page } from '@vitest/browser/context'
import { expect } from 'vitest'

export async function RendersCorrectly() {
  const items = page.getByArticle(part('root'))
  await expect.element(items).toHaveStyle(`
    position: relative; width: 100%; padding-bottom: 56.25%;
  `)
}
