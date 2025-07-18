import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Combobox from '~/vue/dialog.vue'
import * as Tests from './spec'

describe('vue browser tests', () => {
  it('should focus on close button when dialog is open', async () => {
    render(Combobox)
    await Tests.ShouldFocusonCloseButtonWhenDialogIsOpen()
  })

  it('should close modal on escape', async () => {
    render(Combobox)
    await Tests.ShouldCloseOnEscape()
  })
})
