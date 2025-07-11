import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Dialog from '~/vue/dialog.vue'
import * as Tests from './dialog.spec'

describe('dialog vue browser tests', () => {
  it('renders correctly', async () => {
    render(Dialog)
    await Tests.RendersCorrectly()
  })
})
