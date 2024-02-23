import { type Component, type PropType, defineComponent, h, withDirectives } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { BindOnceDirective } from '@destyler/directives'
import { injectDynamicItemContext } from './item'

export const destylerDynamicItemTextProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerDynamicItemTextProps = ExtractPublicPropTypes<typeof destylerDynamicItemTextProps>

export const DestylerDynamicItemText = defineComponent({
  name: 'DestylerDynamicItemText',
  props: destylerDynamicItemTextProps,
  setup() {
    const itemContext = injectDynamicItemContext()
    useForwardExpose()

    return {
      itemContext,
    }
  },
  render() {
    return withDirectives(h(DestylerPrimitive, this.$props, {
      default: () => this.$slots.default ? this.$slots.default?.() : this.itemContext.value.value,
    }), [
      [BindOnceDirective, { id: this.itemContext.textId }],
    ])
  },
})
