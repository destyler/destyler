import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './breadcrumbs.spec'
import Breadcrumbs from './fixtures/Breadcrumbs.svelte'

describe('breadcrumbs svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Breadcrumbs)
    await Tests.RendersCorrectly()
  })
})