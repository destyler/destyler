import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSubTrigger, destylerMenuSubTriggerProps } from '@destyler/menu'

export const destylerContextMenuSubTriggerProps = {
  ...destylerMenuSubTriggerProps,
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
