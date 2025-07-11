import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './file-upload.spec'
import FileUpload from './fixtures/FileUpload.react.tsx'

describe('file-upload react browser tests', () => {
  it('renders correctly', async () => {
    render(<FileUpload />)
    await RendersCorrectly()
  })
})
