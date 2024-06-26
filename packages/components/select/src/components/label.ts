import type { PropType } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import { BindOnceDirective } from '@destyler/directives'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectGroupContext } from './group'

export const destylerSelectLabelProps = {
  ...destylerPrimitiveProps,
  for: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerSelectLabelProps = ExtractPublicPropTypes<typeof destylerSelectLabelProps>

export const DestylerSelectLabel = defineComponent({
  name: 'DestylerSelectLabel',
  props: destylerSelectLabelProps,
  setup() {
    const groupContext = injectSelectGroupContext({ id: '' })

    return {
      groupContext,
    }
  },
  render() {
    return withDirectives(h(DestylerPrimitive, this.$props, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.groupContext.id }],
    ])
  },
})
