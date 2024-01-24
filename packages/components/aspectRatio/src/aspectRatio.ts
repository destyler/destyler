import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'

export const destylerAspectRadioProps = {
  ...destylerPrimitiveProps,
  aspectRatio: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
  },
}

export const DestylerAspectRadio = defineComponent({
  name: 'DestylerAspectRadio',
  props: destylerAspectRadioProps,
  setup(props) {
    const aspect = computed(() => {
      return (1 / props.aspectRatio) * 100
    })

    return {
      aspect,
    }
  },
  render() {
    return h('div', {
      role: 'aspect-ratio',
      style: {
        position: 'relative',
        width: '100%',
        paddingBottom: `${this.aspect}%`,
      },
    }, h(DestylerPrimitive, mergeProps(this.$attrs, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      style: {
        position: 'absolute',
        inset: '0px',
      },
    }), this.$slots.default?.({ aspect: this.aspect })))
  },
})
