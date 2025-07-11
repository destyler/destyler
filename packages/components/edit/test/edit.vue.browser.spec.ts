import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Edit from '~/vue/edit.vue'
import * as Tests from './edit.spec'

describe('edit vue browser tests', () => {
  it('renders correctly', async () => {
    render(Edit)
    await Tests.RendersCorrectly()
  })
})
