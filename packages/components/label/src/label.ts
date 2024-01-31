import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import { useForwardRef } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

const destylerLabelProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  for: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerLabelProps = ExtractPublicPropTypes<typeof destylerLabelProps>

const DestylerLabel = defineComponent({
  name: 'DestylerLabel',
  inheritAttrs: false,
  props: destylerLabelProps,

  setup() {
    const forwardedRef = useForwardRef()

    function handleMousedown(e: MouseEvent): void {
      if (!e.defaultPrevented && e.detail > 1)
        e.preventDefault()
    }

    return {
      handleMousedown,
      forwardedRef,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
      as: 'label',
      for: this.$props.for,
      asChild: this.$props.asChild,
      ref: 'forwardedRef',
      onMousedown: this.handleMousedown,
    }), () => this.$slots.default?.())
  },
})

export {
  DestylerLabel,
}
