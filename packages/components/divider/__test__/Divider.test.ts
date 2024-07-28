import { expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { mount } from '@vue/test-utils'
import { Divider } from '../src'

it('divider', async () => {
  const wrapper = mount(Divider)
  expect(await axe(wrapper.element)).toHaveNoViolations()

  const wrapperVertical = mount(Divider, {
    props: {
      orientation: 'vertical',
    },
  })
  expect(await axe(wrapperVertical.element)).toHaveNoViolations()
})
