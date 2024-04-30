import { type Component, type PropType, defineComponent, h } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerToastDescriptionProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerToastDescriptionProps = ExtractPublicPropTypes<typeof destylerToastDescriptionProps>

export const DestylerToastDescription = defineComponent({
  name: 'DestylerToastDescription',
  props: destylerToastDescriptionProps,
  setup() {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, this.$props, () => this.$slots.default?.())
  },
})
