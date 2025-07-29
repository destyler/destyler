import { TestSuite } from '@destyler/shared-private/test'
import { expect } from 'vitest'

export class BreadcrumbsTestSuite extends TestSuite {
  async RendersCorrectly() {
    const rootEl = this.rootEl()
    await expect.element(rootEl).toBeInTheDocument()
    await expect.element(rootEl).toHaveAttribute('data-part', 'root')
    await expect.element(rootEl).toHaveAttribute('data-scope', 'breadcrumbs')
  }
}
