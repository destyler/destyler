import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Combobox from '~/vue/dialog.vue'
import { ComboboxTestSuite } from './spec'

let Tests: ComboboxTestSuite

describe('vue browser tests', () => {
  beforeEach(async () => {
    render(Combobox)
    Tests = new ComboboxTestSuite()
  })

  it('should focus on close button when dialog is open', async () => {
    await Tests.ShouldFocusonCloseButtonWhenDialogIsOpen()
  })

  it('should close modal on escape', async () => {
    await Tests.ShouldCloseOnEscape()
  })
})
