/** @jsxImportSource solid-js */
import { describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import Combobox from '~/solid/dialog'
import * as Tests from './spec'

describe('react browser tests', () => {
  it('should focus on close button when dialog is open', async () => {
    render(() => <Combobox />)
    await Tests.ShouldFocusonCloseButtonWhenDialogIsOpen()
  })

  it('should close modal on escape', async () => {
    render(() => <Combobox />)
    await Tests.ShouldCloseOnEscape()
  })
})
