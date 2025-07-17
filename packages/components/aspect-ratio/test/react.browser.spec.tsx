import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import AspectRatio from '~/react/aspect-ratio'
import * as Tests from './spec'

describe('react browser tests', () => {
  it('renders correctly', async () => {
    render(<AspectRatio />)
    await Tests.RendersCorrectly()
  })
})
