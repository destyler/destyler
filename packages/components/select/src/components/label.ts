import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectGroupContext } from './group'

export const selectLabelProps = {
  ...primitiveProps,
  /**
   * The id of the element the label is associated with.
   */
  for: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type SelectLabelProps = ExtractPublicPropTypes<typeof selectLabelProps>

export const SelectLabel = defineComponent({
  name: 'DestylerSelectLabel',
  props: selectLabelProps,
  setup() {
    const groupContext = injectSelectGroupContext({ id: '' })

    return {
      groupContext,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, { id: this.groupContext.id }), () => this.$slots.default?.())
  },
})
