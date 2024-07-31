import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { Button } from '../src'
import ButtonSpec from './Button.spec.vue'

describe('default Button', () => {
  let wrapper

  beforeAll(() => {
    wrapper = mount(ButtonSpec)
  })
  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should have attribute `type=Button` by default', () => {
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('should not have attribute \'type=Button\' by default when it\'s not a \'Button\' tag', () => {
    const buttonWrapper = mount(Button, {
      props: {
        as: 'div',
      },
    })
    expect(buttonWrapper.attributes('type')).toBeUndefined()
  })
})
