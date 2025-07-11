import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './breadcrumbs.spec'
import Breadcrumbs from './fixtures/Breadcrumbs.react.tsx'

describe('breadcrumbs react browser tests', () => {
  it('renders correctly', async () => {
    render(<Breadcrumbs />)
    await RendersCorrectly()
  })
})
