import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import FileUpload from '~/vue/file-upload.vue'
import * as Tests from './file-upload.spec'

describe('file-upload vue browser tests', () => {
  it('renders correctly', async () => {
    render(FileUpload)
    await Tests.RendersCorrectly()
  })
})
