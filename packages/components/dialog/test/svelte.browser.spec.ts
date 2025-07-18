import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Combobox from '~/svelte/dialog.svelte'
import * as Tests from './spec'

describe('svelte browser tests', () => {
  it('should focus on close button when dialog is open', async () => {
    render(Combobox)
    await Tests.ShouldFocusonCloseButtonWhenDialogIsOpen()
  })

  it('should close modal on escape', async () => {
    render(Combobox)
    await Tests.ShouldCloseOnEscape()
  })
})
