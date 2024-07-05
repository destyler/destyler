import { defineComponent, h, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { BindOnceDirective } from '@destyler/directives'
import { injectDynamicItemContext } from './item'

export const dynamicItemTextProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type DynamicItemTextProps = ExtractPublicPropTypes<typeof dynamicItemTextProps>

export const DynamicItemText = defineComponent({
  name: 'DestylerDynamicItemText',
  props: dynamicItemTextProps,
  setup() {
    const itemContext = injectDynamicItemContext()
    useForwardExpose()

    return {
      itemContext,
    }
  },
  render() {
    return withDirectives(h(Primitive, this.$props, () => this.$slots.default ? this.$slots.default?.() : this.itemContext.value.value), [
      [BindOnceDirective, { id: this.itemContext.textId }],
    ])
  },
})
