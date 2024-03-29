import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerButton } from '../src'

describe('button', () => {
  it('should work with import on demand', () => {
    mount(DestylerButton)
  })

  it('click', async () => {
    const onClick = vi.fn()
    const inst = mount(DestylerButton, {
      props: {
        onClick,
      },
    })
    await inst.trigger('click')
    expect(onClick).toHaveBeenCalled()
    inst.unmount()
  })

  it('keyboard', async () => {
    const onClick = vi.fn()
    const inst = mount(DestylerButton, {
      props: {
        keyboard: false,
        onClick,
      },
    })
    await inst.trigger('click')
    expect(onClick).toBeCalledTimes(1)
    await inst.trigger('keydown.space')
    expect(onClick).toBeCalledTimes(1)
    await inst.trigger('keydown.enter')
    expect(onClick).toBeCalledTimes(1)
    inst.unmount()
  })

  it('disabled', async () => {
    const onClick = vi.fn()
    const inst = mount(DestylerButton, {
      props: {
        disabled: true,
        onClick,
      },
    })
    await inst.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
    inst.unmount()
  })

  it('should work with attr type', () => {
    ;(['button', 'submit', 'reset'] as const).forEach((type) => {
      const wrapper = mount(DestylerButton, {
        attrs: {
          type,
        },
      })
      expect(wrapper.find('button').attributes('type')).toContain(type)
      wrapper.unmount()
    })
  })
})
