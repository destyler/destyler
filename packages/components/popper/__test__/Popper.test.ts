import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import Popper from './Popper.spec.vue'

describe('give default Popper', async () => {
  let wrapper: VueWrapper<InstanceType<typeof Popper>>
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  beforeEach(() => {
    wrapper = mount(Popper, { attachTo: document.body })
  })

  it('should render correctly and match snapshot', async () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
