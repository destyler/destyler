import { h } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerCollapse, DestylerCollapseItem } from '../src'

describe('DestylerCollapse', () => {
  it('should work with import on demand', () => {
    mount(DestylerCollapse)
  })
  it('can customize icon', () => {
    const wrapper = mount(() => {
      return h(DestylerCollapse, null, {
        default: () => h(DestylerCollapseItem, { name: '1' }, {
          'default': () => h('div', '1'),
          'header-extra': () => h('div', { class: 'my-icon' }),
        }),
      })
    })
    expect(wrapper.find('.my-icon').exists()).toEqual(true)
    wrapper.unmount()
  })

  it('should work with `accordion` prop', async () => {
    const wrapper = mount(() => {
      return h(DestylerCollapse, null, {
        default: () => {
          return [
            h(DestylerCollapseItem, { name: '1' }, {
              default: () => h('div', { class: 'cl1' }, 'cl1'),
            }),
            h(DestylerCollapseItem, { name: '2' }, {
              default: () => h('div', { class: 'cl2' }, 'cl2'),
            }),
            h(DestylerCollapseItem, { name: '3' }, {
              default: () => h('div', { class: 'cl3' }, 'cl3'),
            }),
          ]
        },
      })
    })
    const headerMains = wrapper.findAll('div[destyler="collapse-item-header"]')
    await headerMains[0].trigger('click')
    await headerMains[1].trigger('click')
    expect(wrapper.findAll('div[destyler="collapse-item"]')[0].attributes()['destyler-status']).toEqual('open')
    expect(wrapper.findAll('div[destyler="collapse-item"]')[1].attributes()['destyler-status']).toEqual('open')

    wrapper.unmount()

    const wrapper2 = mount(() => {
      return h(DestylerCollapse, {
        accordion: true,
      }, {
        default: () => {
          return [
            h(DestylerCollapseItem, { name: '1' }, {
              default: () => h('div', { class: 'cl1' }, 'cl1'),
            }),
            h(DestylerCollapseItem, { name: '2' }, {
              default: () => h('div', { class: 'cl2' }, 'cl2'),
            }),
            h(DestylerCollapseItem, { name: '3' }, {
              default: () => h('div', { class: 'cl3' }, 'cl3'),
            }),
          ]
        },
      })
    })

    const headerMains2 = wrapper2.findAll('div[destyler="collapse-item-header"]')
    await headerMains2[2].trigger('click')
    expect(wrapper2.findAll('div[destyler="collapse-item"]')[0].attributes('destyler-status')).toEqual('close')
    expect(wrapper2.findAll('div[destyler="collapse-item"]')[1].attributes('destyler-status')).toEqual('close')
    expect(wrapper2.findAll('div[destyler="collapse-item"]')[2].attributes('destyler-status')).toEqual('open')

    wrapper2.unmount()
  })
  it('should work with nested structure', async () => {
    const wrapper = mount(DestylerCollapse, {
      slots: {
        default: () =>
          h(
            DestylerCollapseItem,
            { name: '1' },
            {
              default: () =>
                h(DestylerCollapse, null, {
                  default: () => h(DestylerCollapseItem, { name: '2' }),
                }),
            },
          ),
      },
    })

    await wrapper.find('div[destyler="collapse-item-header"]').trigger('click')
    expect(wrapper.find('div[destyler="collapse-item"]').attributes('destyler-status')).toEqual('open')

    await wrapper
      .find('div[destyler="collapse"]')
      .find('div[destyler="collapse-item"]')
      .find('div[destyler="collapse"]')
      .find('div[destyler="collapse-item-header"]')
      .trigger('click')
    expect(
      wrapper
        .find('div[destyler="collapse-item"]')
        .find('div[destyler="collapse-item"]')
        .attributes('destyler-status'),
    ).toEqual('open')
    wrapper.unmount()
  })

  it('should work with `display-directive` prop', async () => {
    const wrapper = mount(DestylerCollapse, {
      props: {
        displayDirective: 'show',
      },
      slots: {
        default: () => h(DestylerCollapseItem, {
          name: '1',
        }, {
          default: () => h('div', null, { default: () => 'test' }),
        }),
      },
    })
    await wrapper.find('div[destyler="collapse-item-header"]').trigger('click')
    await wrapper.find('div[destyler="collapse-item-header"]').trigger('click')
    expect(
      wrapper
        .find('div[destyler="collapse"]')
        .find('div[destyler="collapse-item-content"]')
        .attributes('style'),
    ).toBe('display: none;')

    const wrapper2 = mount(DestylerCollapse, {
      props: {
        displayDirective: 'if',
      },
      slots: {
        default: () => h(DestylerCollapseItem, {
          name: '1',
        }, {
          default: () => h('div', null, { default: () => 'test' }),
        }),
      },
    })

    await wrapper2.find('div[destyler="collapse-item-header"]').trigger('click')
    await wrapper2.find('div[destyler="collapse-item-header"]').trigger('click')
    expect(
      wrapper2
        .find('div[destyler="collapse"]')
        .find('div[destyler="collapse-item-content"]')
        .exists(),
    ).toBe(false)
    wrapper2.unmount()
  })
  it('should work with `on-item-header-click` prop', async () => {
    const onClick = vi.fn()
    const wrapper = mount(DestylerCollapse, {
      props: {
        onItemHeaderClick: onClick,
      },
      slots: {
        default: () => h(DestylerCollapseItem, { name: '1' }),
      },
    })
    const triggerNodeWrapper = wrapper.find('div[destyler="collapse-item-header"]')
    await triggerNodeWrapper.trigger('click')
    expect(onClick).toHaveBeenCalled()
    wrapper.unmount()
  })
  it('should work with `slots` ', async () => {
    const wrapper = mount(DestylerCollapse, {
      slots: {
        'header-extra': () => 'header-extra',
        'default': () => h(DestylerCollapseItem, { name: '1' }, {
          header: () => 'header',
        }),
      },
    })
    expect(wrapper.find('div[destyler="collapse-item-header"]').exists()).toBe(true)
    expect(wrapper.find('div[destyler="collapse-item-header-extra"]').exists()).toBe(true)
    expect(wrapper.find('div[destyler="collapse-item-header-extra"]').text()).toBe('header-extra')
    wrapper.unmount()
  })

  it('props.defaultExpandedNames', async () => {
    const wrapper = mount(DestylerCollapse, {
      props: {
        defaultExpandedNames: ['1'],
      },
      slots: {
        default: () => [
          h(DestylerCollapseItem, { name: '1' }, {
            default: () => h('div', { class: 'cl1' }, { default: () => 'cl1' }),
          }),
          h(DestylerCollapseItem, { name: '2' }, {
            default: () => h('div', { class: 'cl2' }, { default: () => 'cl2' }),
          }),
        ],
      },
    })
    expect(wrapper.find('.cl1').isVisible()).toEqual(true)
    expect(wrapper.find('.ci2').exists()).toEqual(false)
    wrapper.unmount()
  })
  it('should work with collapseItem component `title` prop', async () => {
    const wrapper = mount(DestylerCollapse, {
      slots: {
        default: () => h(DestylerCollapseItem, { title: 'test' }),
      },
    })

    await wrapper.find('div[destyler="collapse-item-header"]').trigger('click')
    expect(wrapper.find('div[destyler="collapse-item-header"]').text()).toBe('test')
    wrapper.unmount()
  })
})
