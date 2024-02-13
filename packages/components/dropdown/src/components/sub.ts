import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { DestylerMenuSub } from '@destyler/menu'

export const destylerDropdownSubProps = {
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

export type DestylerDropdownSubProps = ExtractPublicPropTypes<typeof destylerDropdownSubProps>

export const DestylerDropdownSub = defineComponent({
  name: 'DestylerDropdownSub',
  props: destylerDropdownSubProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const open = useVModel(props, 'open', emit, {
      passive: (props.open === undefined) as false,
      defaultValue: props.defaultOpen ?? false,
    })

    useForwardExpose()

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
