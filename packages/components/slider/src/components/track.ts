import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSliderRootContext } from './root'

export const destylerSliderTrackProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
  },
} as const

export type DestylerSliderTrackProps = ExtractPublicPropTypes<typeof destylerSliderTrackProps>

export const DestylerSliderTrack = defineComponent({
  name: 'DestylerSliderTrack',
  props: destylerSliderTrackProps,
  setup() {
    const rootContext = injectSliderRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      asChild: this.$props.asChild,
      as: this.$props.as,
    }, () => this.$slots.default?.())
  },
})
