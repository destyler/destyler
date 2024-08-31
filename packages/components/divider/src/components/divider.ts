import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { DataOrientation, ExtractPublicPropTypes } from '@destyler/shared'

export const dividerProps = {
  ...primitiveProps,
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

export type DividerProps = ExtractPublicPropTypes<typeof dividerProps>

export const Divider = defineComponent({
  name: 'DestylerDivider',
  props: dividerProps,

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
    return h(Primitive, mergeProps(this.semanticProps, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-orientation': this.computedOrientation,
    }), () => this.$slots.default?.())
  },
})
