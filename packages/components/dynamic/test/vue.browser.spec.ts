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
})
