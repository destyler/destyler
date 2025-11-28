import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Tour'

let mountEl: HTMLElement
let cleanup: (() => void) | undefined

function getOverlayPart(part: string) {
  return page.locatoring(`[data-scope="tour"][data-part=${part}]`).first()
}

function getAction(type: 'next' | 'prev' | 'close' | 'custom' = 'next') {
  return page.locatoring(`[data-scope="tour"][data-part="action-trigger"][data-type=${type}]`)
}

async function setCheckbox(testId: string, checked: boolean) {
  const control = document.querySelector<HTMLInputElement>(`[data-testid="${testId}"]`)
  if (!control)
    throw new Error(`Control ${testId} not found`)
  if (control.checked !== checked)
    await userEvent.click(control)
}

async function startTour() {
  await page.getByRole('button', { name: 'Start Tour' }).click()
  await seeTourOpen()
}

async function seeTourClosed() {
  await expect.element(getOverlayPart('content')).not.toBeVisible()
}

async function seeTourOpen() {
  await expect.element(getOverlayPart('content')).toBeVisible()
}

describe('[tour] browser tests', () => {
  beforeEach(() => {
    cleanup?.()
    cleanup = undefined
    if (mountEl && mountEl.parentElement)
      document.body.removeChild(mountEl)
    mountEl = document.createElement('div')
    document.body.appendChild(mountEl)
    cleanup = render(mountEl)
  })

  afterEach(() => {
    cleanup?.()
    cleanup = undefined
    if (mountEl && mountEl.parentElement)
      document.body.removeChild(mountEl)
  })

  it('starts tour when clicking start button', async () => {
    await startTour()
    await seeTourOpen()
    await expect.element(getOverlayPart('content')).toHaveAttribute('data-step', 'step-0')
  })

  it('closes when pressing escape (default behavior)', async () => {
    await startTour()
    await seeTourOpen()
    await testHook.pressKey('Escape')
    await seeTourClosed()
  })

  it('navigates through steps using action buttons', async () => {
    await startTour()

    const nextButton = getAction('next')
    await nextButton.click()
    await expect.element(getOverlayPart('content')).toHaveAttribute('data-step', 'step-1')

    const prevButton = getAction('prev')
    await prevButton.click()
    await expect.element(getOverlayPart('content')).toHaveAttribute('data-step', 'step-0')
  })

  it('shows spotlight/backdrop when step targets elements', async () => {
    await startTour()

    await getAction('next').click()

    await expect.element(getOverlayPart('backdrop')).toBeVisible()
    await expect.element(getOverlayPart('spotlight')).toBeVisible()
    await expect.element(getOverlayPart('arrow')).toBeVisible()
  })

  it('allows keyboard navigation when enabled', async () => {
    await startTour()

    await testHook.pressKey('ArrowRight')
    await expect.element(getOverlayPart('content')).toHaveAttribute('data-step', 'step-1')

    await testHook.pressKey('ArrowLeft')
    await expect.element(getOverlayPart('content')).toHaveAttribute('data-step', 'step-0')
  })

  it('can toggle keyboard navigation off via controls', async () => {
    await setCheckbox('keyboardNavigation', false)

    await startTour()

    await testHook.pressKey('ArrowRight')
    await expect.element(getOverlayPart('content')).toHaveAttribute('data-step', 'step-0')
  })

  it('can disable escape close via controls', async () => {
    await setCheckbox('closeOnEscape', false)

    await startTour()
    await testHook.pressKey('Escape')
    await seeTourOpen()
  })

  it('closes when clicking outside by default', async () => {
    await startTour()
    await getOverlayPart('positioner').click({ position: { x: 8, y: 8 } })
    await seeTourClosed()
  })

  it('honors preventInteraction control by inerting target', async () => {
    await setCheckbox('preventInteraction', false)

    await startTour()

    await getAction('next').click()
    const firstTarget = page.locatoring('#step-1')

    await expect.element(firstTarget).not.toHaveAttribute('inert', '')

    await setCheckbox('preventInteraction', true)

    await testHook.pressKey('ArrowRight')

    const secondTarget = page.locatoring('#step-2')
    await expect.element(secondTarget).toHaveAttribute('inert', '')
  })
})
