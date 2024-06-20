import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useForwardRef } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

const destylerLabelProps = {
  asChild: {
    ...destylerPrimitiveProps.asChild,
  },
  for: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerLabelProps = ExtractPublicPropTypes<typeof destylerLabelProps>

export const DestylerLabel = defineComponent({
  name: 'DestylerLabel',
  inheritAttrs: false,
  props: destylerLabelProps,
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
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
      as: 'label',
      for: this.$props.for,
      asChild: this.$props.asChild,
      onMousedown: this.handleMousedown,
    }), () => this.$slots.default?.())
  },
})
