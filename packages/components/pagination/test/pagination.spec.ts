import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '../examples/vanilla/Pagination'

let mount: HTMLElement | null = null

async function seeItemIsCurrent(id: string) {
  const item = testHook.getItem(`pagination-item-${id}`)
  await expect.element(item).toHaveAttribute('aria-current', 'page')
}

describe('pagination browser tests', () => {
  beforeEach(() => {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  afterEach(() => {
    if (mount && mount.parentElement)
      document.body.removeChild(mount)
    mount = null
  })

  it('marks the first page as current and disables prev', async () => {
    await seeItemIsCurrent('1')
    await expect.element(page.getByTestId('prev:trigger')).toHaveAttribute('data-disabled', '')
    const next = await page.getByTestId('next:trigger').element()
    expect(next.getAttribute('data-disabled')).not.toBe('')
  })

  it('should update page when item is clicked', async () => {
    await testHook.clickItem('pagination-item-2')
    await seeItemIsCurrent('2')
    await testHook.clickItem('pagination-item-5')
    await seeItemIsCurrent('5')
  })

  it('should update page when next button is clicked', async () => {
    await testHook.clickTrigger('next')
    await seeItemIsCurrent('2')
    await testHook.clickTrigger('next', {
      count: 3,
    })
    await testHook.clickItem('pagination-item-5')
    await seeItemIsCurrent('5')
  })

  it('should update page when prev button is clicked', async () => {
    await testHook.clickTrigger('next', {
      count: 4,
    })

    await seeItemIsCurrent('5')

    await testHook.clickTrigger('next')
    await testHook.clickTrigger('prev')
    await seeItemIsCurrent('5')
    await testHook.clickTrigger('prev', {
      count: 3,
    })
    await seeItemIsCurrent('2')
  })

  it('enables prev after leaving the first page', async () => {
    await testHook.clickTrigger('next')
    await seeItemIsCurrent('2')
    const prev = await page.getByTestId('prev:trigger').element()
    expect(prev.getAttribute('data-disabled')).not.toBe('')
  })
})
