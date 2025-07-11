import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Pagination from '~/vue/pagination.vue'
import * as Tests from './pagination.spec'

describe('pagination vue browser tests', () => {
  it('renders correctly', async () => {
    render(Pagination)
    await Tests.RendersCorrectly()
  })
})
