import { part, TestSuite } from '@destyler/shared-private/test'
import { page } from 'vitest/browser'
import { expect } from 'vitest'

export class ImageTestSuite extends TestSuite {
  async ShouldRenderCorrectly() {
    const el = page.getByArticle(part('image'))
    await this.waitFor()
    await expect.element(el).toBeVisible()
  }
}
