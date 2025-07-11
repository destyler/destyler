import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './pagination.spec'
import Pagination from './fixtures/Pagination.vue'

describe('pagination vue browser tests', () => {
  it('renders correctly', async () => {
    render(Pagination)
    await Tests.RendersCorrectly()
  })
})