import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const arrowProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'svg',
  },
  width: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  height: {
    type: Number as PropType<number>,
    required: false,
    default: 5,
  },
} as const

export type ArrowProps = ExtractPublicPropTypes<typeof arrowProps>

export const Arrow = defineComponent({
  name: 'DestylerArrow',
  props: arrowProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      width: this.$props.width,
      height: this.$props.height,
      viewBox: this.asChild ? undefined : '0 0 30 10',
      preserveAspectRatio: this.asChild ? undefined : 'none',
    }), () => {
      return this.$slots.default
        ? this.$slots.default?.()
        : h('polygon', {
          points: '0,0 30,0 15,10',
        })
    })
  },
})
