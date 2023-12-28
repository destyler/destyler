import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createId, sleep } from '@destyler/shared'
import type { PopoverInst } from '../src'
import { DestylerPopover } from '../src'

const TriggerComponent1 = defineComponent({
  name: 'TriggerComponent1',
  render() {
    return h('div', 'GoGoGo')
  },
})

describe('destylerPopover', () => {
  it('should work with import on demand', () => {
    mount(DestylerPopover, {
      slots: {
        trigger: () => 'star kirby',
        default: () => h('div', 'star kirby'),
      },
    })
  })

  ;(['hover', 'click'] as const).forEach((trigger) => {
    ;['text', 'div', 'Fragment', TriggerComponent1].forEach((type) => {
      const classNameHash: string = `${trigger}-${typeof type === 'string' ? type : type.name}`
      it(`reigger node ${classNameHash}`, async () => {
        const triggerEvent = trigger === 'hover' ? 'mouseenter' : 'click'
        const hideTriggerEvent = trigger === 'hover' ? 'mouseleave' : 'click'
        const triggerNode
          = type === 'text'
            ? h('span', 'star kirby')
            : type === 'Fragment'
              ? h(type as any, { class: `star-kirby-${classNameHash}-trigger` }, {})
              : h(type as any, { class: `star-kirby-${classNameHash}-trigger` }, {})
        const wrapper = mount(DestylerPopover, {
          attachTo: document.body,
          props: {
            trigger,
            delay: 0,
            duration: 0,
          },
          slots: {
            trigger: () => triggerNode,
            default: () => h('div', { class: `star-kirby-${classNameHash}-content` }),
          },
        })
        const triggerNodeWrapper
          = type === 'text'
            ? wrapper.find('span')
            : wrapper.find(`.star-kirby-${classNameHash}-trigger`)
        await triggerNodeWrapper.trigger(triggerEvent)
        expect(document.querySelector(`.star-kirby-${classNameHash}-content`)).not.toEqual(null)
        await triggerNodeWrapper.trigger(hideTriggerEvent)
        expect(document.querySelector(`.star-kirby-${classNameHash}-content`)).toEqual(null)
        const inst = wrapper.vm as any as PopoverInst
        inst.setShow(true)
        await nextTick()
        expect(document.querySelector(`.star-kirby-${classNameHash}-content`)).not.toEqual(null)

        inst.setShow(false)
        await nextTick()
        expect(document.querySelector(`.star-kirby-${classNameHash}-content`)).toEqual(null)

        wrapper.unmount()
      })
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
