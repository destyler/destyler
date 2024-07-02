import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { Slot } from './slot'

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

export const primitiveProps = {
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

export type PrimitiveProps = ExtractPublicPropTypes<typeof primitiveProps>

export const Primitive = defineComponent({
  name: 'DestylerPrimitive',
  props: primitiveProps,
  setup(props) {
    const asTag = props.asChild ? 'template' : props.as

    return {
      asTag,
    }
  },
  render() {
    const SELT_CLOSING_TAGS = ['area', 'img', 'input']
    if (typeof this.asTag === 'string' && SELT_CLOSING_TAGS.includes(this.asTag))
      return h(this.asTag, this.$attrs)

    if (this.asTag !== 'template')
      return h(this.$props.as, this.$attrs, { default: this.$slots.default })

    return h(Slot, this.$attrs, { default: this.$slots.default })
  },
})
