import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { DestylerTag } from '../src'

describe('basic', () => {
  it('should work with import on demand', () => {
    mount(DestylerTag)
  })

  it('should be clickable', () => {
    const onClick = vi.fn()
    const wrapper = mount(DestylerTag, {
      props: {
        onClick,
      },
    })

    wrapper.trigger('click')
    expect(onClick).toBeCalled()
  })

  it('should work with `on-update:checked` prop', () => {
    const onChecked = vi.fn()
    const wrapper = mount(DestylerTag, {
      props: {
        'checkable': true,
        'onUpdate:checked': onChecked,
        'onUpdateChecked': onChecked,
      },
    })

    wrapper.trigger('click')
    expect(onChecked).toBeCalled()
    expect(onChecked).toBeCalledTimes(2)
  })
  it('should be `checkable` prop', async () => {
    const wrapper = mount(DestylerTag, {
      props: {
        checkable: true,
      },
    })

    await wrapper.setProps({ checked: true })
    expect(wrapper.find('div[destyler="tag"]').attributes('data-checked')).toContain(true)

    await wrapper.setProps({ checked: false })
    expect(wrapper.find('div[destyler="tag"]').attributes('data-checked')).not.toContain(true)
  })

  it('should work with `closable` `on-close` prop', () => {
    const onClose = vi.fn()
    const wrapper = mount(DestylerTag, {
      props: {
        closable: true,
        onClose,
      },
      slots: {
        close: () => h('span', 'close'),
      },
    })

    expect(wrapper.find('div[destyler="tag-close"]').exists()).toBe(true)
    wrapper.find('div[destyler="tag-close"]').trigger('click')
    expect(onClose).toBeCalled()
  })
  it('should work with `disabled` prop', async () => {
    const onClose = vi.fn()
    const wrapper = mount(DestylerTag, {
      props: {
        disabled: true,
        closable: true,
        onClose,
      },
      slots: {
        close: () => h('span', 'close'),
      },
    })

    expect(wrapper.find('div[destyler="tag"]').attributes('data-disabled')).toContain(true)
    wrapper.find('div[destyler="tag-close"]').trigger('click')
    expect(onClose).not.toBeCalled()
  })
  it('should work with default slot', () => {
    const wrapper = mount(DestylerTag, {
      slots: {
        default: () => 'default',
      },
    })

    expect(wrapper.find('span[destyler="tag-content"]').exists()).toBe(true)
    expect(wrapper.find('span[destyler="tag-content"]').element.textContent).toBe('default')
    expect(wrapper.find('span[destyler="tag-content"]').html()).toMatchSnapshot()
  })
  it('should work with `avatar` slot', () => {
    const wrapper = mount(DestylerTag, {
      slots: {
        avatar: () =>
          h('img', {
            src: 'https://github.com/elonehoo.png',
          }),
      },
    })

    expect(wrapper.find('div[destyler="tag-avatar"]').exists()).toBe(true)
  })
})
