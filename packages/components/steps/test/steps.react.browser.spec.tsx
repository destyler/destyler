import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Steps from './fixtures/Steps.react.tsx'
import { RendersCorrectly } from './steps.spec'

describe('steps react browser tests', () => {
  it('renders correctly', async () => {
    render(<Steps />)
    await RendersCorrectly()
  })
})
