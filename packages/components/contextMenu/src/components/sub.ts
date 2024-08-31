import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { MenuSub, menuSubProps } from '@destyler/menu'
import { menuSubEmits } from '@destyler/menu/component'

export const contextMenuSubProps = {
  ...menuSubProps,
  /**
   * The open state of the submenu when it is initially rendered. Use when you do not need to control its open state.
   *
   * @default false
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ContextMenuSubProps = ExtractPublicPropTypes<typeof contextMenuSubProps>

export const contextMenuSubEmits = {
  ...menuSubEmits,
}

export const ContextMenuSub = defineComponent({
  name: 'DestylerContextMenuSub',
  props: contextMenuSubProps,
  emits: contextMenuSubEmits,
  slots: Object as SlotsType<{
    default: (props: {
      /**
       * Whether the submenu is open.
       */
      open?: boolean
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    useForwardExpose()

    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    })
    return {
      open,
    }
  },
  render() {
    return h(MenuSub, {
      'open': this.open,
      'onUpdate:open': (value: boolean) => {
        this.open = value
      },
    }, () => this.$slots.default?.({ open: this.open }))
  },
})
