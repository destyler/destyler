import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { BackTop } from '../src'

describe('default BackTop', () => {
  it('should work with import on demand', () => {
    mount(BackTop, {
      attachTo: document.body,
    })
  })

  it('should work with `show` prop', async () => {
    document.body.innerHTML = `${document.body.innerHTML}
      <div id="test" style="height: 3000px; width: 100%;"></div>
    `

    const wrapper = mount(BackTop, {
      attachTo: document.getElementById('test') ?? undefined,
    })

    wrapper.element.scrollTop = 1000
    await wrapper.trigger('scroll')
    expect(wrapper.html()).toContain('<!---->')
    wrapper.unmount()
  })
})
