import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './signature.spec'
import Signature from './fixtures/Signature.vue'

describe('signature vue browser tests', () => {
  it('renders correctly', async () => {
    render(Signature)
    await Tests.RendersCorrectly()
  })
})