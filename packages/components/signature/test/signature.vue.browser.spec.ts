import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Signature from '~/vue/signature.vue'
import * as Tests from './signature.spec'

describe('signature vue browser tests', () => {
  it('renders correctly', async () => {
    render(Signature)
    await Tests.RendersCorrectly()
  })
})
