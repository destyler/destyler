import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Breadcrumbs from '~/svelte/breadcrumbs.svelte'
import * as Tests from './spec'

describe('breadcrumbs svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Breadcrumbs)
    await Tests.RendersCorrectly()
  })
})
