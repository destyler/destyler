import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Image'

let mount: HTMLElement | null = null

async function expectStatus(machine: string, statusChange?: string) {
  const status = page.getByTestId('image-status')
  await expect.element(status).toHaveAttribute('data-machine-status', machine)
  if (statusChange != null)
    await expect.element(status).toHaveAttribute('data-status-change', statusChange)
}

describe('image browser tests', () => {
  beforeEach(() => {
    if (mount?.parentElement)
      document.body.removeChild(mount)
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  afterEach(() => {
    if (mount?.parentElement)
      document.body.removeChild(mount)
    mount = null
  })

  it('should render correctly', async () => {
    const el = page.getByArticle(testHook.part('image'))
    await testHook.waitFor()
    await expect.element(el).toBeVisible()
  })

  it('[loaded] settles loading→loaded and fires onStatusChange', async () => {
    const image = page.getByArticle(testHook.part('image'))
    const fallback = page.getByArticle(testHook.part('fallback'))

    await expect.element(image).toBeVisible()
    await expect.element(image).toHaveAttribute('data-state', 'visible')
    await expect.element(fallback).toHaveAttribute('data-state', 'hidden')
    await expectStatus('loaded', 'loaded')
  })

  it('[error] loading→error via bad src and fires onStatusChange', async () => {
    await page.getByTestId('image-bad').click()

    const image = page.getByArticle(testHook.part('image'))
    const fallback = page.getByArticle(testHook.part('fallback'))

    await expectStatus('error', 'error')
    await expect.element(fallback).toHaveAttribute('data-state', 'visible')
    await expect.element(image).toHaveAttribute('data-state', 'hidden')
  })

  it('[reload] bad→ok recovers to loaded', async () => {
    await page.getByTestId('image-bad').click()
    await expectStatus('error', 'error')

    await page.getByTestId('image-ok').click()
    await expectStatus('loaded', 'loaded')
    await expect.element(page.getByArticle(testHook.part('image'))).toHaveAttribute('data-state', 'visible')
  })
})
