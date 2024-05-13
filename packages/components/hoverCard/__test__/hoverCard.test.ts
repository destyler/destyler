import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { sleep } from '@destyler/test/utils'
import HoverCard from '../demos/HoverCard.spec.vue'

describe('given a default HoverCard', () => {
  let wrapper: VueWrapper<InstanceType<typeof HoverCard>>
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  beforeEach(() => {
    wrapper = mount(HoverCard, { attachTo: document.body })
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('after mouse enter for a 100ms', () => {
    it('should pass axe accessibility tests', async () => {
      await wrapper.find('a').trigger('mouseenter')
      await sleep(100)
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })
})
