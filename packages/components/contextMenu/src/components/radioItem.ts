import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuRadioItem } from '@destyler/menu'

export const destylerContextMenuRadioItemProps = {
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
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  textValue: {
    type: String as PropType<string>,
    required: false,
  },
  value: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type DestylerContextMenuRadioItemProps = ExtractPublicPropTypes<typeof destylerContextMenuRadioItemProps>

export const DestylerContextMenuRadioItem = defineComponent({
  name: 'DestylerContextMenuRadioItem',
  props: destylerContextMenuRadioItemProps,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerMenuRadioItem, {
      ...this.$props,
      ...this.emitsAsProps,
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
