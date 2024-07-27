import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { MenuRadioGroup, menuRadioGroupProps } from '@destyler/menu'
import { menuRadioGroupEmits } from '@destyler/menu/component'

export const contextMenuRadioGroupProps = {
  ...menuRadioGroupProps,
} as const

export type ContextMenuRadioGroupProps = ExtractPublicPropTypes<typeof contextMenuRadioGroupProps>

export const contextMenuRadioGroupEmits = {
  ...menuRadioGroupEmits,
}

export const ContextMenuRadioGroup = defineComponent({
  name: 'DestylerContextMenuRadioGroup',
  props: contextMenuRadioGroupProps,
  emits: contextMenuRadioGroupEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      emitsAsProps,
    }
  },
  render() {
    return h(MenuRadioGroup, mergeProps(this.$props, this.emitsAsProps), () => this.$slots.default?.())
  },
})
