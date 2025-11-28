import { stepsData } from '@destyler/shared-private'
import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Steps'

let el: HTMLElement

function stepTrigger(index: number) {
  return page.locatoring(`[data-steps-trigger="${index}"]`)
}

function stepIndicator(index: number) {
  return page.locatoring(`[data-steps-indicator="${index}"]`)
}

function stepSeparator(index: number) {
  return page.locatoring(`[data-steps-separator="${index}"]`)
}

function stepContent(index: number | 'complete') {
  const contentId = index === 'complete' ? 'complete' : index
  return page.locatoring(`[data-steps-content="${contentId}"]`)
}

function listEl() {
  return page.locatoring('[data-part=list]')
}

function completeContent() {
  return stepContent('complete')
}

function linearToggle() {
  return page.getByTestId('linear')
}

function orientationSelect() {
  return page.getByTestId('orientation')
}

async function clickNext(times = 1) {
  const next = testHook.getNextEl()
  for (let i = 0; i < times; i++) {
    await next.click()
  }
}

async function clickPrev(times = 1) {
  const prev = testHook.getPrevEl()
  for (let i = 0; i < times; i++) {
    await prev.click()
  }
}

describe('[steps] browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('renders first step by default and disables previous navigation', async () => {
    const items = testHook.getItemEls()
    expect(items.all().length).toBe(stepsData.length)
    await expect.element(stepContent(0)).toBeVisible()
    await expect.element(stepContent(1)).not.toBeVisible()
    await expect.element(completeContent()).not.toBeVisible()

    await expect.element(testHook.getPrevEl()).toBeDisabled()
    await expect.element(testHook.getNextEl()).toBeEnabled()

    await expect.element(stepTrigger(0)).toHaveAttribute('data-state', 'open')
    await expect.element(stepIndicator(0)).toHaveAttribute('data-current', '')
    await expect.element(stepIndicator(1)).toHaveAttribute('data-incomplete', '')
  })

  it('allows jumping to arbitrary steps when linear navigation is disabled', async () => {
    await stepTrigger(2).click()

    await expect.element(stepContent(2)).toBeVisible()
    await expect.element(stepIndicator(2)).toHaveAttribute('data-current', '')
    await expect.element(stepIndicator(0)).toHaveAttribute('data-complete', '')
    await expect.element(stepIndicator(1)).toHaveAttribute('data-complete', '')
  })

  it('prevents skipping ahead when linear mode is enabled', async () => {
    await linearToggle().click()

    await expect.element(stepTrigger(2)).toHaveAttribute('tabindex', '-1')
    await stepTrigger(2).click()

    await expect.element(stepContent(0)).toBeVisible()
    await expect.element(stepIndicator(0)).toHaveAttribute('data-current', '')
  })

  it('navigates through steps via next/prev triggers and reaches completion', async () => {
    await clickNext()
    await expect.element(stepContent(1)).toBeVisible()
    await expect.element(testHook.getPrevEl()).toBeEnabled()

    await clickNext()
    await expect.element(stepContent(2)).toBeVisible()

    await clickNext()
    await expect.element(completeContent()).toBeVisible()
    await expect.element(testHook.getNextEl()).toBeDisabled()

    await clickPrev()
    await expect.element(stepContent(2)).toBeVisible()
    await expect.element(testHook.getNextEl()).toBeEnabled()
  })

  it('updates orientation attributes when changed via controls', async () => {
    await expect.element(listEl()).toHaveAttribute('data-orientation', 'horizontal')

    await orientationSelect().selectOptions('vertical')

    await expect.element(listEl()).toHaveAttribute('data-orientation', 'vertical')
    await expect.element(stepTrigger(0)).toHaveAttribute('data-orientation', 'vertical')
  })

  it('updates indicator and separator states as the user progresses', async () => {
    await clickNext()

    await expect.element(stepIndicator(0)).toHaveAttribute('data-complete', '')
    await expect.element(stepIndicator(1)).toHaveAttribute('data-current', '')
    await expect.element(stepSeparator(0)).toHaveAttribute('data-complete', '')
    await expect.element(stepSeparator(2)).toHaveAttribute('data-incomplete', '')
  })
})
