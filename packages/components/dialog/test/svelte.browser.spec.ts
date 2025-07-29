import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Combobox from '~/svelte/dialog.svelte'
import { ComboboxTestSuite } from './spec'

let Tests: ComboboxTestSuite

describe('svelte browser tests', () => {
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
