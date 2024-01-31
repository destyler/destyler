import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'

export const destylerSelectIconProps = {
  ...destylerPrimitiveProp,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
}

export const DestylerSelectIcon = defineComponent({
  name: 'DestylerSelectIcon',
  props: destylerSelectIconProps,
  render() {
    return h(DestylerPrimitive, {
      'aria-hidden': '',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
    }, this.$slots.default ? this.$slots.default?.() : '▼')
  },
})
