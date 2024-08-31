import type { PropType } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { BindOnceDirective } from '@destyler/directives'

import { injectComboboxGroupContext } from './group'

export const comboboxLabelProps = {
  ...primitiveProps,
  for: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type ComboboxLabelProps = ExtractPublicPropTypes<typeof comboboxLabelProps>

export const ComboboxLabel = defineComponent({
  name: 'DestylerComboboxLabel',
  props: comboboxLabelProps,

  setup() {
    useForwardExpose()
    const groupContext = injectComboboxGroupContext({ id: '' })

    return {
      groupContext,
    }
  },
  render() {
    return withDirectives(h(Primitive, this.$props, {
      default: () => this.$slots.default?.(),
    }), [
      [BindOnceDirective, { id: this.groupContext.id }],
    ])
  },
})
