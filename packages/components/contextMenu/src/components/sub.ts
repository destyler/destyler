import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { DestylerMenuSub } from '@destyler/menu'

export const destylerContextMenuSubProps = {
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerContextMenuSubProps = ExtractPublicPropTypes<typeof destylerContextMenuSubProps>

export const DestylerContextMenuSub = defineComponent({
  name: 'DestylerContextMenuSub',
  props: destylerContextMenuSubProps,
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
    return h(DestylerMenuSub, {
      'open': this.open,
      'onUpdate:open': (value: boolean) => {
        this.open = value
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
