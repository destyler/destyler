import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { DestylerAspectRadio } from '../src'

describe('aspectRatio', async () => {
  let wrapper: VueWrapper<InstanceType<typeof DestylerAspectRadio>>

  beforeEach(() => {
    wrapper = mount(DestylerAspectRadio, {
      slots: {
        default: `<img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" class="h-full w-full object-cover" alt="Destyler Image">`,
      },
    })
  })

  it('axe accessibility', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('render as snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
