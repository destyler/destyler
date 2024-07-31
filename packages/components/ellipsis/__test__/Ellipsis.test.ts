import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Ellipsis from './Ellipsis.spec.vue'

describe('default Ellipsis', () => {
  it('default', async () => {
    mount(Ellipsis)
  })
})
