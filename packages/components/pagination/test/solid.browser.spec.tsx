/** @jsxImportSource solid-js */
import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import Pagination from '~/solid/pagination'
import { PaginationTestSuite } from './spec'

let Tests: PaginationTestSuite

describe('solid browser tests', () => {
  beforeEach(() => {
    render(() => <Pagination />)
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
