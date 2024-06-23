import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerSplitterRootProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerSplitterRootProps = ExtractPublicPropTypes<typeof destylerSplitterRootProps>

export const DestylerSplitterRoot = defineComponent({
  name: 'DestylerSplitterRoot',
  props: destylerSplitterRootProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, () => this.$slots.default?.())
  },
})
