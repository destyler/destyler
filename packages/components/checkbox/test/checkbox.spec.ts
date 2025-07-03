import { part } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

const root = part('root')
const label = part('label')
const control = part('control')

export async function RendersCorrectly() {
  const rootEL = page.getByArticle(root)
  userEvent.click(rootEL)
  await expect.element(page.getByArticle(root)).toHaveAttribute('data-state', 'checked')
  await expect.element(page.getByArticle(label)).toHaveAttribute('data-state', 'checked')
  await expect.element(page.getByArticle(control)).toHaveAttribute('data-state', 'checked')
}
