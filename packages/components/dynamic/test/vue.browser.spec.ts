import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Dynamic from '~/vue/dynamic.vue'
import * as Tests from './spec'

describe('vue browser tests', () => {
  it('should add new tag value', async () => {
    render(Dynamic)
    await Tests.ShouldAddNewTagValue()
  })

  it('when input is empty backspace highlights the last tag', async () => {
    render(Dynamic)
    await Tests.WhenInputIsEmptyBackspaceHighlightsLastTag()
  })

  it('deletes tag with backspace when input value is empty', async () => {
    render(Dynamic)
    await Tests.DeletesTagWithBackspaceWhenInputValueIsEmpty()
  })

  it('delete tag by clearing its content and hit enter', async () => {
    render(Dynamic)
    await Tests.DeleteTagByClearingItsContentAndHitEnter()
  })

  it('delete tag with delete key, show allow keyboard navigation', async () => {
    render(Dynamic)
    await Tests.DeleteTagWithDeleteKeyShowAllowKeyboardNavigation()
  })

  it('delete tag with pointer, show allow keyboard navigation', async () => {
    render(Dynamic)
    await Tests.DeleteTagWithPointerShowAllowKeyboardNavigation()
  })

  it('when tag is empty + no visible tags + enter pressed, should not enter editing state', async () => {
    render(Dynamic)
    await Tests.WhenTagIsEmptyNoVisibleTagsEnterPressedShouldNotEnterEditingState()
  })

  it('should navigate tags with arrow keys', async () => {
    render(Dynamic)
    await Tests.ShouldNavigateTagsWithArrowKeys()
  })

  it('should clear focused tag on blur', async () => {
    render(Dynamic)
    await Tests.ShouldClearFocusedTagOnBlur()
  })

  it('removes tag on close button click', async () => {
    render(Dynamic)
    await Tests.RemovesTagOnCloseButtonClick()
  })

  it.skip('edit tag with enter key', async () => {
    render(Dynamic)
    await Tests.EditTagWithEnterKey()
  })
})
