import type { PropType } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { BindOnceDirective } from '@destyler/directives'

import { injectComboboxGroupContext } from './group'

export const destylerComboboxLabelProps = {
  ...destylerPrimitiveProps,
  for: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerComboboxLabelProps = ExtractPublicPropTypes<typeof destylerComboboxLabelProps>

export const DestylerComboboxLabel = defineComponent({
  name: 'DestylerComboboxLabel',
  props: destylerComboboxLabelProps,
  setup() {
    useForwardExpose()
    const groupContext = injectComboboxGroupContext({ id: '' })

    return {
      groupContext,
    }
  },
  render() {
    return withDirectives(h(DestylerPrimitive, this.$props, {
      default: () => this.$slots.default?.(),
    }), [
      [BindOnceDirective, { id: this.groupContext.id }],
    ])
  },
})
