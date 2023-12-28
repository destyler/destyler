import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerBackTop } from '../src'

describe('destylerBackTop', () => {
  it('should work with import on demand', () => {
    mount(DestylerBackTop, {
      attachTo: document.body,
    })
  })
  it('should work with `show` prop', async () => {
    document.body.innerHTML
      = `${document.body.innerHTML
      }
      <div id="test" style="height: 3000px; width: 100%;"></div>
    `

    const wrapper = mount(DestylerBackTop, {
      attachTo: document.getElementById('test') ?? undefined,
      props: {
        show: true,
      },
    })

    wrapper.element.scrollTop = 1000
    await wrapper.trigger('scroll')
    expect(wrapper.html()).toContain('teleport start')
    wrapper.unmount()
  })
})
