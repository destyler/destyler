import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { createId, sleep } from '@destyler/shared'
import { DestylerPopover } from '../src'

const TriggerComponent1 = defineComponent({
  name: 'TriggerComponent1',
  render() {
    return h('div', 'GoGoGo')
  },
})

describe('DestylerPopover', () => {
  it('should work with import on demand', () => {
    mount(DestylerPopover, {
      slots: {
        trigger: () => 'star kirby',
        default: () => h('div', 'star kirby'),
      },
    })
  })
  it('delay & duration', async () => {
    const id = createId()
    const triggerClass = `trigger-${id}`
    const contentClass = `content-${id}`
    const wrapper = mount(DestylerPopover, {
      attachTo: document.body,
      props: {
        trigger: 'hover',
        delay: 100,
        duration: 100,
      },
      slots: {
        trigger: () => h('div', { class: `${triggerClass}` }),
        default: () => h('div', { class: `${contentClass}` }),
      },
    })

    await wrapper.find(`.${triggerClass}`).trigger('mouseenter')
    expect(document.querySelector(`.${contentClass}`)).toEqual(null)
    await sleep(150)
    expect(document.querySelector(`.${contentClass}`)).not.toEqual(null)
    await wrapper.find(`.${triggerClass}`).trigger('mouseleave')
    expect(document.querySelector(`.${contentClass}`)).not.toEqual(null)
    await sleep(150)
    expect(document.querySelector(`.${contentClass}`)).toEqual(null)
    wrapper.unmount()
  })
  it('header & footer slots', () => {
    const wrapper = mount(DestylerPopover, {
      attachTo: document.body,
      props: {
        show: true,
      },
      slots: {
        trigger: () => h('div', null, h('span', 'click')),
        header: () => h('div', 'I am title'),
        default: () => h('div', 'star kirby'),
        footer: () => h('div', 'I am footer'),
      },
    })
    wrapper.unmount()
  })
})
