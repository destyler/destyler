import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Pagination from './fixtures/Pagination.svelte'
import * as Tests from './pagination.spec'

describe('pagination svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Pagination)
    await Tests.RendersCorrectly()
  })
})
