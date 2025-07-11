import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './toast.spec'
import Toast from './fixtures/Toast.vue'

describe('toast vue browser tests', () => {
  it('renders correctly', async () => {
    render(Toast)
    await Tests.RendersCorrectly()
  })
})