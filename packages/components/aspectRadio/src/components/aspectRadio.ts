import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerAspectRadioProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  aspectRatio: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
  },
} as const

export type DestylerAspectRadioProps = ExtractPublicPropTypes<typeof destylerAspectRadioProps>

export const DestylerAspectRadio = defineComponent({
  name: 'DestylerAspectRadio',
  inheritAttrs: false,
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
      'style': {
        position: 'relative',
        width: '100%',
        paddingBottom: `${this.aspect}%`,
      },
      'data-destyler-aspect-ratio-wrapper': '',
    }, () => h(DestylerPrimitive, mergeProps(this.$attrs, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      style: {
        position: 'absolute',
        inset: '0px',
      },
    }), () => this.$slots.default?.({ aspect: this.aspect })))
  },
})
