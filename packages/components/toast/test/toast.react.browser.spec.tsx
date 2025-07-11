import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Toast from './fixtures/Toast.react.tsx'
import { RendersCorrectly } from './toast.spec'

describe('toast react browser tests', () => {
  it('renders correctly', async () => {
    render(<Toast />)
    await RendersCorrectly()
  })
})
