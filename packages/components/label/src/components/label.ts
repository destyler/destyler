import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardRef } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const labelProps = {
  asChild: {
    ...primitiveProps.asChild,
  },
  /**
   * The id of the element the label is associated with.
   */
  for: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type LabelProps = ExtractPublicPropTypes<typeof labelProps>

export const Label = defineComponent({
  name: 'DestylerLabel',
  inheritAttrs: false,
  props: labelProps,
  setup() {
    useForwardRef()

    function handleMousedown(e: MouseEvent): void {
      if (!e.defaultPrevented && e.detail > 1)
        e.preventDefault()
    }

    return {
      handleMousedown,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$attrs, {
      as: 'label',
      for: this.$props.for,
      asChild: this.$props.asChild,
      onMousedown: this.handleMousedown,
    }), () => this.$slots.default?.())
  },
})
