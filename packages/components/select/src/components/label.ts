import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import { BindOnceDirective } from '@destyler/directives'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectGroupContext } from './group'

export const selectLabelProps = {
  ...primitiveProps,
  for: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type SelectLabelProps = ExtractPublicPropTypes<typeof selectLabelProps>

export const SelectLabel = defineComponent({
  name: 'DestylerSelectLabel',
  props: selectLabelProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const groupContext = injectSelectGroupContext({ id: '' })

    return {
      groupContext,
    }
  },
  render() {
    return withDirectives(h(Primitive, this.$props, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.groupContext.id }],
    ])
  },
})
