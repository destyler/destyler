import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Dynamic from '~/svelte/dynamic.svelte'
import * as Tests from './spec'

describe('svelte browser tests', () => {
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

  it('edit tag with enter key', async () => {
    render(Dynamic)
    await Tests.EditTagWithEnterKey()
  })

  it('edit with double click', async () => {
    render(Dynamic)
    await Tests.EditTagWithDoubleClick()
  })

  it('clears highlighted tag on escape press', async () => {
    render(Dynamic)
    await Tests.ClearsHighlightedTagOnEscapePress()
  })

  it('delete + backspace interaction', async () => {
    render(Dynamic)
    await Tests.DeleteTagWithBackspaceWhenInputValueIsEmpty()
  })

  it('[addOnPaste: false] pasting should work every time', async () => {
    render(Dynamic)
    await Tests.AddOnPasteFalsePastingShouldWorkEveryTime()
  })

  it('[addOnPaste: false] pasting + enter should work', async () => {
    render(Dynamic)
    await Tests.AddOnPasteFalsePastingEnterShouldWork()
  })

  it('[addOnPaste: true] pasting should add tags', async () => {
    render(Dynamic)
    await Tests.AddOnPasteTruePastingShouldAddTags()
  })

  it('[addOnPaste: true] when input is empty, should work', async () => {
    render(Dynamic)
    await Tests.AddOnPasteTrueWhenInputIsEmptyShouldWork()
  })
})
