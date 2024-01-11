import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'
import { useForwardRef } from '@destyler/composition'

const destylerLabelProps = {
  ...destylerPrimitiveProp,
  for: {
    type: String as PropType<string>,
    required: false,
  },
}

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
    return h(DestylerPrimitive, {
      as: 'label',
      for: this.$props.for,
      asChild: this.$props.asChild,
      ref: 'forwardedRef',
      ...mergeProps(this.$attrs),
      onMousedown: this.handleMousedown,
    }, () => this.$slots.default?.())
  },
})

export {
  DestylerLabel,
}
