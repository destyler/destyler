import { defineComponent, h, withDirectives } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { BindOnceDirective } from '@destyler/directives'
import { injectDynamicItemContext } from './item'

export const destylerDynamicItemTextProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
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
    return withDirectives(h(DestylerPrimitive, this.$props, () => this.$slots.default ? this.$slots.default?.() : this.itemContext.value.value), [
      [BindOnceDirective, { id: this.itemContext.textId }],
    ])
  },
})
