import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, markRaw } from 'vue'
import { DestylerPrimitive } from '../src/primitive'

describe('test DestylerPrimitive functionalities', () => {
  it('should work with import on demand', () => {
    mount(DestylerPrimitive)
  })

  it('should render button element correctly', async () => {
    const wrapper = mount(DestylerPrimitive, {
      props: {
        as: 'button',
      },
    })
    expect(wrapper.find('button').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should renders div element with custom attribute', () => {
    const wrapper = mount(DestylerPrimitive, {
      attrs: {
        type: 'button',
      },
    })

    const element = wrapper.find('div')

    expect(element.attributes('type')).toBe('button')
    wrapper.unmount()
  })

  it('should renders multiple child elements', () => {
    const wrapper = mount(DestylerPrimitive, {
      slots: {
        default: '<div>1</div><div>2</div><div>3</div>',
      },
    })

    const element = wrapper.find('div')
    expect(element.findAll('div').length).toBe(3)
    wrapper.unmount()
  })
})

describe('render as template (asChild)', () => {
  it('should merge child\'s class together', () => {
    const wrapper = mount(DestylerPrimitive, {
      props: {
        as: 'template',
      },
      attrs: {
        class: 'parent-class',
      },
      slots: {
        default:
          '<div class="child-class more-child-class">Child class</div>',
      },
    })

    const element = wrapper.find('div')
    expect(element.attributes('class')).toEqual(
      'child-class more-child-class parent-class',
    )
  })

  it('should render the Component that passed in as', () => {
    const Button = markRaw(defineComponent({
      setup(props, { slots }) {
        return () => h('button', { id: 'custom-button' }, slots)
      },
    }))

    const wrapper = mount(DestylerPrimitive, {
      props: {
        as: Button,
      },
      attrs: {
        class: 'parent-class',
      },
    })

    expect(wrapper.html()).toBe(
      '<button id="custom-button" class="parent-class"></button>',
    )
  })

  it('should render the child class element tag', () => {
    const wrapper = mount(DestylerPrimitive, {
      props: {
        as: 'template',
      },

      slots: {
        default: '<a>Child class</a>',
      },
    })

    const element = wrapper.find('a')
    expect(element.exists()).toBeTruthy()
  })

  it('should render the child component', () => {
    const ChildComponent = {
      template: '<div id="child">Hello world</div>',
    }
    const RootComponent = {
      components: { ChildComponent, DestylerPrimitive },
      template: '<DestylerPrimitive><ChildComponent /></DestylerPrimitive>',
    }

    const wrapper = mount(RootComponent, {
      props: {
        as: 'template',
      },
    })

    const element = wrapper.find('div')
    expect(element.html()).toBe('<div id="child">Hello world</div>')
  })

  it('should inherit parent attributes and the child attributes', () => {
    const wrapper = mount(DestylerPrimitive, {
      props: {
        as: 'template',
      },
      attrs: {
        'data-parent-attr': '',
      },
      slots: {
        default: '<div data-child-attr>Child class</div>',
      },
    })

    const element = wrapper.find('div')
    expect(element.attributes('data-parent-attr')).toBe('')
    expect(element.attributes('data-child-attr')).toBe('')
  })

  it('\'asChild=true\' should work the same as \'as=template\'', () => {
    const wrapper = mount(DestylerPrimitive, {
      props: {
        asChild: true,
      },
      attrs: {
        class: 'parent-class',
      },
      slots: {
        default: '<button class="child-class">Child element</button>',
      },
    })

    const element = wrapper.find('button')
    expect(element.exists()).toBe(true)
    expect(element.attributes('class')).toBe('child-class parent-class')
  })
})
