import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Breadcrumbs from '~/react/breadcrumbs'
import * as Tests from './spec'

describe('breadcrumbs react browser tests', () => {
  it('renders correctly', async () => {
    render(<Breadcrumbs />)
    await Tests.RendersCorrectly()
  })
})
