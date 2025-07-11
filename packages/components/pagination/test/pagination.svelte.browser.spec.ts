import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './pagination.spec'
import Pagination from './fixtures/Pagination.svelte'

describe('pagination svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Pagination)
    await Tests.RendersCorrectly()
  })
})