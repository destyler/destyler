import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Pagination from '~/svelte/pagination.svelte'
import { PaginationTestSuite } from './spec'

let Tests: PaginationTestSuite

describe('svelte browser tests', () => {
  beforeEach(() => {
    render(Pagination)
    Tests = new PaginationTestSuite()
  })

  it('should update page when item is clicked', async () => {
    await Tests.ShouldUpdatePageWhenItemIsClicked()
  })

  it('should update page when next button is clicked', async () => {
    await Tests.ShouldUPdatePageWhenNextButtonIsClicked()
  })

  it('should update page when prev button is clicked', async () => {
    await Tests.ShouldUpdatePageWhenPrevButtonIsClicked()
  })
})
