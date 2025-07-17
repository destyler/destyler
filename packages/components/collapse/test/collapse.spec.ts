import { testid } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

function getTrigger(id: string) {
  return page.getByArticle(testid(`${id}:trigger`))
}

function getContent(id: string) {
  return page.getByArticle(testid(`${id}:content`))
}

export async function arrowDownFocusNextTrigger() {
  const trigger = getTrigger('watercraft')
  await trigger.click()
  await userEvent.keyboard('{ArrowDown}')
  await userEvent.keyboard('{/ArrowDown}')
  await expect.element(getTrigger('automobiles')).toHaveFocus()
}

export async function arrowUpFocusPreviousTrigger() {
  const trigger = getTrigger('automobiles')
  await trigger.click()
  await userEvent.keyboard('{ArrowDown}')
  await userEvent.keyboard('{/ArrowDown}')
  await userEvent.keyboard('{ArrowUp}')
  await userEvent.keyboard('{/ArrowDown}')
  await expect.element(trigger).toHaveFocus()
}

export async function homeKeyFocusFirstTrigger() {
  const trigger = getTrigger('automobiles')
  await trigger.click()
  await userEvent.keyboard('{Home}')
  await userEvent.keyboard('{/Home}')
  await expect.element(getTrigger('watercraft')).toHaveFocus()
}

export async function endKeyFocusLastTrigger() {
  const trigger = getTrigger('watercraft')
  await trigger.click()
  await userEvent.keyboard('{End}')
  await userEvent.keyboard('{/End}')
  await expect.element(getTrigger('aircraft')).toHaveFocus()
}

export async function shouldShowContent() {
  const trigger = getTrigger('watercraft')
  await trigger.click()
  await expect.element(getContent('watercraft')).toBeVisible()
}

export async function ShouldNotCloseTheContent() {
  const trigger = getTrigger('watercraft')
  await trigger.dblClick()

  await expect.element(getContent('watercraft')).not.toBeVisible()
}

export async function ShouldCloseThePreviousContent() {
  await getTrigger('watercraft').click()
  await getTrigger('automobiles').click()
  await expect.element(getContent('automobiles')).toBeVisible()
  await expect.element(getContent('watercraft')).not.toBeVisible()
}

export async function OnArrowDownFocusNextTrigger() {
  await page.getByTestId('multiple').click()
  const trigger = getTrigger('watercraft')
  await trigger.dblClick()

  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')

  await userEvent.keyboard('{ArrowDown}')
  await userEvent.keyboard('{/ArrowDown}')
  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')

  await expect.element(getContent('watercraft')).toBeVisible()
  await expect.element(getContent('automobiles')).toBeVisible()
}

export async function clickingAnotherTriggerShouldCloseThePreviousContent() {
  await page.getByTestId('multiple').click()
  await getTrigger('watercraft').click()
  await getTrigger('automobiles').click()

  await expect.element(getContent('watercraft')).toBeVisible()
  await expect.element(getContent('automobiles')).toBeVisible()
}
