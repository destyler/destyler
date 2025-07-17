import { part } from '@destyler/shared-private/test'
import { page } from '@vitest/browser/context'
import { expect } from 'vitest'

const root = part('root')

// === 基础渲染测试 ===
export async function RendersCorrectly() {
  const componentEl = page.getByArticle(root)
  await expect.element(componentEl).toBeInTheDocument()
  await expect.element(componentEl).toHaveAttribute('data-part', 'root')
  await expect.element(componentEl).toHaveAttribute('data-scope', 'breadcrumbs')
}
