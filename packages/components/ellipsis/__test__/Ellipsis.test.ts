import { beforeEach, describe, expect, it } from 'vitest'
import { type VueWrapper, mount } from '@vue/test-utils'
import Ellipsis from './Ellipsis.spec.vue'

describe('default Ellipsis', () => {
  it('default', async () => {
    mount(Ellipsis)
  })
})
