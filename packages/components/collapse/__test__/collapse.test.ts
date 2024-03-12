import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import Collapse from './Collapse.spec.vue'

describe.skip('given a single Collapse', () => {
  let wrapper: VueWrapper<InstanceType<typeof Collapse>>
  beforeEach(() => {
    document.body.innerHTML = ''
    wrapper = mount(Collapse, { attachTo: document.body })
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
