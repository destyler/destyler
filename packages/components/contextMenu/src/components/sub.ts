import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { MenuSub, menuSubProps } from '@destyler/menu'

export const contextMenuSubProps = {
  ...menuSubProps,
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ContextMenuSubProps = ExtractPublicPropTypes<typeof contextMenuSubProps>

export const ContextMenuSub = defineComponent({
  name: 'DestylerContextMenuSub',
  props: contextMenuSubProps,
  emits: ['update:open'],
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
    }, () => this.$slots.default?.())
  },
})
