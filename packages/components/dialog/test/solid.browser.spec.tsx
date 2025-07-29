/** @jsxImportSource solid-js */
import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import Combobox from '~/solid/dialog'
import { ComboboxTestSuite } from './spec'

let Tests: ComboboxTestSuite

describe('react browser tests', () => {
  beforeEach(async () => {
    render(() => <Combobox />)
    Tests = new ComboboxTestSuite()
  })

  it('should focus on close button when dialog is open', async () => {
    await Tests.ShouldFocusonCloseButtonWhenDialogIsOpen()
  })

  it('should close modal on escape', async () => {
    await Tests.ShouldCloseOnEscape()
  })
})
