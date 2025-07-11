import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './file-upload.spec'
import FileUpload from './fixtures/FileUpload.svelte'

describe('file-upload svelte browser tests', () => {
  it('renders correctly', async () => {
    render(FileUpload)
    await Tests.RendersCorrectly()
  })
})