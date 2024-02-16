import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerMenuItem } from '@destyler/menu'

export const destylerContextMenuItemProps = {
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
} as const

export type DestylerContextMenuItemProps = ExtractPublicPropTypes<typeof destylerContextMenuItemProps>

export const DestylerContextMenuItem = defineComponent({
  name: 'DestylerContextMenuItem',
  props: destylerContextMenuItemProps,
  emits: ['select'],
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(DestylerMenuItem, mergeProps(this.$props, this.emitsAsProps), {
      default: () => this.$slots.default?.(),
    })
  },
})