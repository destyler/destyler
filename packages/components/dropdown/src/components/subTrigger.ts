import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSubTrigger, destylerMenuSubTriggerProps } from '@destyler/menu'

export const destylerDropdownSubTriggerProps = {
  ...destylerMenuSubTriggerProps,
} as const

export type DestylerDropdownSubTriggerProps = ExtractPublicPropTypes<typeof destylerDropdownSubTriggerProps>

export const DestylerDropdownSubTrigger = defineComponent({
  name: 'DestylerDropdownSubTrigger',
  props: destylerDropdownSubTriggerProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSubTrigger, this.$props, () => this.$slots.default?.())
  },
})
