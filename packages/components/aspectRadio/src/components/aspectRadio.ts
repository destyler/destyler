import type { PropType, SlotsType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const aspectRadioProps = {
  ...primitiveProps,
  aspectRatio: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
  },
} as const

export type AspectRadioProps = ExtractPublicPropTypes<typeof aspectRadioProps>

export const AspectRadio = defineComponent({
  name: 'DestylerAspectRadio',
  inheritAttrs: false,
  props: aspectRadioProps,
  slots: Object as SlotsType<{
    default: { aspect: number }
  }>,
  setup(props) {
    const { forwardRef } = useForwardExpose()

    const aspect = computed(() => {
      return (1 / props.aspectRatio) * 100
    })

    return {
      forwardRef,
      aspect,
    }
  },
  render() {
    return h('div', {
      'style': {
        position: 'relative',
        width: '100%',
        paddingBottom: `${this.aspect}%`,
      },
      'data-destyler-aspect-ratio-wrapper': '',
    }, h(Primitive, mergeProps(this.$attrs, {
      ref: (el: any) => this.forwardRef(el),
      as: this.$props.as,
      asChild: this.$props.asChild,
      style: {
        position: 'absolute',
        inset: '0px',
      },
    }), () => this.$slots.default?.({ aspect: this.aspect })))
  },
})
