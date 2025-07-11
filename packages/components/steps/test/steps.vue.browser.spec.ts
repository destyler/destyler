import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Steps from '~/vue/step.vue'
import * as Tests from './steps.spec'

describe('steps vue browser tests', () => {
  it('renders correctly', async () => {
    render(Steps)
    await Tests.RendersCorrectly()
  })
})
