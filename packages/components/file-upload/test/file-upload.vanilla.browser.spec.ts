import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './file-upload.spec'
import { FileUpload } from './fixtures/FileUpload.ts'

describe('file-upload vanilla browser tests', () => {
  it('renders correctly', async () => {
    new FileUpload({ root: document.body })
    await Tests.RendersCorrectly()
  })
})