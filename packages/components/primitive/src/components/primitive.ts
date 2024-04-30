import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { DestylerSlot } from './slot'

export type AsTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | 'template'
  // eslint-disable-next-line ts/ban-types
  | ({} & string) // any other string

export const destylerPrimitiveProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerPrimitiveProps = ExtractPublicPropTypes<typeof destylerPrimitiveProps>

export const DestylerPrimitive = defineComponent({
  name: 'DestylerPrimitive',
  props: destylerPrimitiveProps,
  setup(props) {
    const asTag = props.asChild ? 'template' : props.as

    return {
      asTag,
    }
  },
  render() {
    if (this.asTag !== 'template') {
      return h(this.$props.as, this.$attrs, {
        default: () => this.$slots.default?.(),
      })
    }
    else {
      return h(DestylerSlot, this.$attrs, () => {
        return this.$slots.default?.()
      })
    }
  },
})
