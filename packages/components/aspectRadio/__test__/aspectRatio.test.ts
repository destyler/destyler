import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import AspectRadio from '../demos/AspectRadio.space.vue'

describe('aspectRatio', async () => {
  let wrapper: VueWrapper<InstanceType<typeof AspectRadio>>

  beforeEach(() => {
    wrapper = mount(AspectRadio)
  })

  it('axe accessibility', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('render as snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
