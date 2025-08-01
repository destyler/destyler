import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import Menu from '~/solid/menu'
import { MenuTestSuite } from './spec'

let Tests: MenuTestSuite

describe('menu solid browser tests', () => {
  beforeEach(async () => {
    render(() => <Menu />)
    Tests = new MenuTestSuite()
  })

  it('should open when trigger is clicked', async () => {
    await Tests.ShouldOpenWhenTriggerIsClicked()
  })

  it('should close when clicked outside', async () => {
    await Tests.ShouldCloseWhenClickedOutside()
  })

  it('should navigate items with keyboard', async () => {
    await Tests.ShouldNavigateItemsWithKeyboard()
  })

  it('should select item when clicked', async () => {
    await Tests.ShouldSelectItemWhenClicked()
  })

  it('should select item with enter key', async () => {
    await Tests.ShouldSelectItemWithEnterKey()
  })

  it('should close with escape key', async () => {
    await Tests.ShouldCloseWithEscapeKey()
  })

  it('should be focusable with tab', async () => {
    await Tests.ShouldBeFocusableWithTab()
  })

  it('should open with space', async () => {
    await Tests.ShouldOpenWithSpace()
  })
})