import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '../examples/vanilla/Pagination'

let mount: HTMLElement | null = null

async function seeItemIsCurrent(id: string) {
  const item = testHook.getItem(`pagination-item-${id}`)
  await expect.element(item).toHaveAttribute('aria-current', 'page')
}

describe('pagination browser tests', () => {
  beforeEach(() => {
    if (mount) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
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
})
