import type { SlotsType } from 'vue';
import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const splitterRootProps = {
  ...primitiveProps,
} as const

export type SplitterRootProps = ExtractPublicPropTypes<typeof splitterRootProps>

export const SplitterRoot = defineComponent({
  name: 'DestylerSplitterRoot',
  props: splitterRootProps,
  slots: Object as SlotsType<{
    default: () => void
  }>,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(Primitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, () => this.$slots.default?.())
  },
})
