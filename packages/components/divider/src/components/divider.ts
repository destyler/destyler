import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { DataOrientation, ExtractPublicPropTypes } from '@destyler/shared'

export const destylerDividerProps = {
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
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'horizontal',
  },
  decorative: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerDividerProps = ExtractPublicPropTypes<typeof destylerDividerProps>

export const DestylerDivider = defineComponent({
  name: 'DestylerDivider',
  props: destylerDividerProps,
  setup(props) {
    const ORIENTATIONS = ['horizontal', 'vertical'] as const
    function isValidOrientation(orientation: any): orientation is DataOrientation {
      return ORIENTATIONS.includes(orientation)
    }

    const computedOrientation = computed(() =>
      isValidOrientation(props.orientation) ? props.orientation : 'horizontal',
    )
    // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
    const ariaOrientation = computed(() =>
      computedOrientation.value === 'vertical' ? props.orientation : undefined,
    )

    const semanticProps = computed(() =>
      props.decorative
        ? { role: 'none' }
        : { 'aria-orientation': ariaOrientation.value, 'role': 'separator' },
    )

    return {
      computedOrientation,
      semanticProps,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.semanticProps, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-orientation': this.computedOrientation,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
