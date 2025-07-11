import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './dialog.spec'
import Dialog from './fixtures/Dialog.react.tsx'

describe('dialog react browser tests', () => {
  it('renders correctly', async () => {
    render(<Dialog />)
    await RendersCorrectly()
  })
})
