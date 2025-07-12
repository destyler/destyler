import { part, testid } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

const trigger = part('trigger')
const content = part('content')

export async function ShouldBeOpenWhenClicked() {
  await page.getByArticle(trigger).click()
  await expect.element(page.getByArticle(content)).toBeVisible()

  await page.getByArticle(trigger).click()
  await expect.element(page.getByArticle(content)).not.toBeVisible()
}

export async function ContentShouldNotBeReachableViaTabKey() {
  await page.getByArticle(trigger).click()
  await page.getByArticle(trigger).click()
  await userEvent.tab()

  await expect.element(page.getByRole('button', { name: 'Open' })).toHaveFocus()
}
