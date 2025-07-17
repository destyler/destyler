import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Combobox from '~/react/combobox'
import * as Tests from './spec'

describe('combobox react browser tests', () => {
  it('should open combobox menu when arrow is clicked', async () => {
    render(<Combobox />)
    await Tests.ShouldOpenComboboxMenuWhenArrowIsClicked()
  })

  it('escape should close content', async () => {
    render(<Combobox />)
    await Tests.EscapeShouldCloseContent()
  })

  it('should open combobox menu when typing', async () => {
    render(<Combobox />)
    await Tests.ShouldOpenComboboxMenuWhenTyping()
  })

  it('pointer / selection', async () => {
    render(<Combobox />)
    await Tests.PointerAndSelection()
  })

  it('select and select again', async () => {
    render(<Combobox />)
    await Tests.SelectAndSelectAgain()
  })

  it('[loop] on arrow down, open and highlight first enabled option', async () => {
    render(<Combobox />)
    await Tests.OnArrowDownOpenAndHighlightFirstEnabledOption()
  })

  it('[no-loop] on arrow down, open and highlight first enabled option', async () => {
    render(<Combobox />)
    await Tests.NoLoopOnArrowDownOpenAndHighlightFirstEnabledOption()
  })

  it('[loop] on arrow up, open and highlight last enabled option', async () => {
    render(<Combobox />)
    await Tests.OnArrowUpOpenAndHighlightLastEnabledOption()
  })

  it('[no-loop] on arrow up, open and highlight last enabled option', async () => {
    render(<Combobox />)
    await Tests.NoLoopOnArrowUpOpenAndHighlightLastEnabledOption()
  })

  it('on home and end, when open, focus first and last option', async () => {
    render(<Combobox />)
    await Tests.OnHomeAndEndFocusFirstAndLastOption()
  })

  it('keyboard / arrowdown / loop', async () => {
    render(<Combobox />)
    await Tests.KeyBoardArrowDownLoop()
  })

  it('keyboard / arrowdown / no-loop', async () => {
    render(<Combobox />)
    await Tests.KeyBoardArrowDownNoLoop()
  })

  it('keyboard / arrowup / loop', async () => {
    render(<Combobox />)
    await Tests.KeyBoardArrowUpLoop()
  })

  it('keyboard / arrowup / no-loop', async () => {
    render(<Combobox />)
    await Tests.KeyBoardArrowUpNoLoop()
  })

  it('[pointer / open-on-click]', async () => {
    render(<Combobox />)
    await Tests.PointerOpenOnClick()
  })

  it('selects value on click', async () => {
    render(<Combobox />)
    await Tests.SelectsValueOnClick()
  })

  it('can clear value', async () => {
    render(<Combobox />)
    await Tests.CanClearValue()
  })

  it('[selection=clear] should clear input value', async () => {
    render(<Combobox />)
    await Tests.ShouldClearInputValue()
  })

  it('[no value] enter behavior for custom values', async () => {
    render(<Combobox />)
    await Tests.EnterBehaviorForCustomValues()
  })
})
