import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Combobox from '~/react/combobox'
import { ComboboxTestSuite } from './spec'

let Tests: ComboboxTestSuite

describe('combobox react browser tests', () => {
  beforeEach(async () => {
    render(<Combobox />)
    Tests = new ComboboxTestSuite()
  })

  it('should open combobox menu when arrow is clicked', async () => {
    await Tests.ShouldOpenComboboxMenuWhenArrowIsClicked()
  })

  it('escape should close content', async () => {
    await Tests.EscapeShouldCloseContent()
  })

  it('should open combobox menu when typing', async () => {
    await Tests.ShouldOpenComboboxMenuWhenTyping()
  })

  it('pointer / selection', async () => {
    await Tests.PointerAndSelection()
  })

  it('select and select again', async () => {
    await Tests.SelectAndSelectAgain()
  })

  it('[loop] on arrow down, open and highlight first enabled option', async () => {
    await Tests.OnArrowDownOpenAndHighlightFirstEnabledOption()
  })

  it('[no-loop] on arrow down, open and highlight first enabled option', async () => {
    await Tests.NoLoopOnArrowDownOpenAndHighlightFirstEnabledOption()
  })

  it('[loop] on arrow up, open and highlight last enabled option', async () => {
    await Tests.OnArrowUpOpenAndHighlightLastEnabledOption()
  })

  it('[no-loop] on arrow up, open and highlight last enabled option', async () => {
    await Tests.NoLoopOnArrowUpOpenAndHighlightLastEnabledOption()
  })

  it('on home and end, when open, focus first and last option', async () => {
    await Tests.OnHomeAndEndFocusFirstAndLastOption()
  })

  it('keyboard / arrowdown / loop', async () => {
    await Tests.KeyBoardArrowDownLoop()
  })

  it('keyboard / arrowdown / no-loop', async () => {
    await Tests.KeyBoardArrowDownNoLoop()
  })

  it('keyboard / arrowup / loop', async () => {
    await Tests.KeyBoardArrowUpLoop()
  })

  it('keyboard / arrowup / no-loop', async () => {
    await Tests.KeyBoardArrowUpNoLoop()
  })

  it('[pointer / open-on-click]', async () => {
    await Tests.PointerOpenOnClick()
  })

  it('selects value on click', async () => {
    await Tests.SelectsValueOnClick()
  })

  it('can clear value', async () => {
    await Tests.CanClearValue()
  })

  it('[selection=clear] should clear input value', async () => {
    await Tests.ShouldClearInputValue()
  })

  it('[no value] enter behavior for custom values', async () => {
    await Tests.EnterBehaviorForCustomValues()
  })
})
