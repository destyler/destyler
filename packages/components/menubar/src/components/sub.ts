import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { DestylerMenuSub, destylerMenuSubProps } from '@destyler/menu'

export const destylerMenubarSubProps = {
  ...destylerMenuSubProps,
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerMenubarSubProps = ExtractPublicPropTypes<typeof destylerMenubarSubProps>

export const DestylerMenubarSub = defineComponent({
  name: 'DestylerMenubarSub',
  props: destylerMenubarSubProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen ?? false,
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
    }, () => this.$slots.default?.())
  },
})
