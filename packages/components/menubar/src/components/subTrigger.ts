import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuSubTrigger, destylerMenuSubTriggerProps } from '@destyler/menu'

export const destylerMenubarSubTriggerProps = {
  ...destylerMenuSubTriggerProps,
} as const

export type DestylerMenubarSubTriggerProps = ExtractPublicPropTypes<typeof destylerMenubarSubTriggerProps>

export const DestylerMenubarSubTrigger = defineComponent({
  name: 'DestylerMenubarSubTrigger',
  props: destylerMenubarSubTriggerProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerMenuSubTrigger, mergeProps(this.$props, {
      'data-destyler-menubar-subtrigger': '',
    }), () => this.$slots.default?.())
  },
})
