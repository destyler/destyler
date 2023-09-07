import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DestylerButton from '../src/button'

describe('Button', () => {
  // Tests that the button component renders with default props
  it('should render button component with default props', () => {
    // Arrange
    const wrapper = mount(DestylerButton)

    // Assert
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').attributes('destyler')).toBe('button')
    expect(wrapper.find('button').attributes('type')).toBe('button')
    expect(wrapper.find('button').attributes('disabled')).toBe(undefined)
    expect(wrapper.find('button').attributes('autofocus')).toBe('false')
  })

  // Tests that the button component renders with custom props
  it('should render button component with custom props', () => {
    // Arrange
    const wrapper = mount(DestylerButton, {
      props: {
        attrType: 'submit',
        focusable: true,
        disabled: true,
      },
      slots: {
        default: 'Custom Button',
      },
    })

    // Act

    // Assert
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').attributes('destyler')).toBe('button')
    expect(wrapper.find('button').attributes('type')).toBe('submit')
    expect(wrapper.find('button').attributes('disabled')).toBe('')
    expect(wrapper.find('button').attributes('autofocus')).toBe('true')
    expect(wrapper.find('button').text()).toBe('Custom Button')
  })

  // Tests that the button component renders with slot content
  it('should render button component with slot content', () => {
    // Arrange
    const wrapper = mount(DestylerButton, {
      slots: {
        default: 'Slot Content',
      },
    })

    // Act

    // Assert
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Slot Content')
  })

  // Tests that the button component renders with the disabled prop
  it('should render button component with the disabled prop', () => {
    // Arrange
    const wrapper = mount(DestylerButton, {
      props: {
        disabled: true,
      },
    })

    // Act

    // Assert
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').attributes('disabled')).toBe('')
  })

  // Tests that the button component renders with the focusable prop
  it('should render button component with the focusable prop', () => {
    // Arrange
    const wrapper = mount(DestylerButton, {
      props: {
        focusable: true,
      },
    })

    // Act

    // Assert
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').attributes('autofocus')).toBe('true')
  })
})
