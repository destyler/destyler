import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { DestylerAspectRadio } from '../src'

describe('given a default AspectRatio', async () => {
  let wrapper: VueWrapper<InstanceType<typeof DestylerAspectRadio>>

  beforeEach(() => {
    wrapper = mount(DestylerAspectRadio, {
      slots: {
        default: `<img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">`,
      },
    })
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should render as snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
