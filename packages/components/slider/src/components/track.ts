import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSliderRootContext } from './root'

export const destylerSliderTrackProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
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
    }, this.$slots.default?.())
  },
})
