import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Image from './fixtures/Image.react.tsx'
import { RendersCorrectly } from './image.spec'

describe('image react browser tests', () => {
  it('renders correctly', async () => {
    render(<Image />)
    await RendersCorrectly()
  })
})
