import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'

export const destylerArrowProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'svg',
  },
  width: {
    type: Number as PropType<number>,
    required: false,
    default: 5,
  },
  height: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
}

export const DestylerArrow = defineComponent({
  name: 'DestylerArrow',
  props: destylerArrowProps,
  setup(_, { slots }) {
    const { customElement } = useCustomElement()

    const hasSlot = !!slots.default

    return {
      hasSlot,
      customElement,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      width: this.$props.width,
      height: this.$props.height,
      viewBox: this.asChild ? undefined : '0 0 30 10',
      preserveAspectRatio: this.asChild ? undefined : 'none',
    }), this.hasSlot
      ? this.$slots.default?.()
      : h('polygon', {
        points: '0,0 30,0 15,10',
      }))
  },
})
