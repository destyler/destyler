import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './file-upload.spec'
import FileUpload from './fixtures/FileUpload.vue'

describe('file-upload vue browser tests', () => {
  it('renders correctly', async () => {
    render(FileUpload)
    await Tests.RendersCorrectly()
  })
})