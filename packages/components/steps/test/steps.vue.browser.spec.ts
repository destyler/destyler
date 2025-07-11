import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './steps.spec'
import Steps from './fixtures/Steps.vue'

describe('steps vue browser tests', () => {
  it('renders correctly', async () => {
    render(Steps)
    await Tests.RendersCorrectly()
  })
})