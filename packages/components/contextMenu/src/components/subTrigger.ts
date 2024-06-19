import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSubTrigger } from '@destyler/menu'

export const destylerContextMenuSubTriggerProps = {
  ...destylerPrimitiveProps,
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  textValue: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerContextMenuSubTriggerProps = ExtractPublicPropTypes<typeof destylerContextMenuSubTriggerProps>

export const DestylerContextMenuSubTrigger = defineComponent({
  name: 'DestylerContextMenuSubTrigger',
  props: destylerContextMenuSubTriggerProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSubTrigger, this.$props, () => this.$slots.default?.())
  },
})
