import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './dialog.spec'
import Dialog from './fixtures/Dialog.vue'

describe('dialog vue browser tests', () => {
  it('renders correctly', async () => {
    render(Dialog)
    await Tests.RendersCorrectly()
  })
})