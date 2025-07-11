import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './edit.spec'
import Edit from './fixtures/Edit.vue'

describe('edit vue browser tests', () => {
  it('renders correctly', async () => {
    render(Edit)
    await Tests.RendersCorrectly()
  })
})