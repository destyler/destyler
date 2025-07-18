import { part } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

async function clickTrigger(opts: { delay?: number } = {}) {
  const triggerEl = page.getByArticle(part('trigger'))
  await userEvent.click(triggerEl, {
    delay: opts.delay,
  })
}

async function seeCloseIsFocused() {
  const closeButton = page.getByArticle(part('close-trigger'))
  await expect.element(closeButton).toHaveFocus()
}

async function seeTriggerIsFocused() {
  const triggerEl = page.getByArticle(part('trigger'))
  await expect.element(triggerEl).toHaveFocus()
}

async function dontSeeContent() {
  const contentEl = page.getByArticle(part('content'))
  await expect.element(contentEl).not.toBeVisible()
}

export async function ShouldFocusonCloseButtonWhenDialogIsOpen() {
  await clickTrigger()
  await seeCloseIsFocused()
}

export async function ShouldCloseOnEscape() {
  await clickTrigger()

  await userEvent.keyboard('{Escape}')
  await userEvent.keyboard('{\Escape}')

  await dontSeeContent()
  await seeTriggerIsFocused()
}
