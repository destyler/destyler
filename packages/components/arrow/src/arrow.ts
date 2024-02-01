import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerArrowProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
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
} as const

export type DestylerArrowProps = ExtractPublicPropTypes<typeof destylerArrowProps>

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
