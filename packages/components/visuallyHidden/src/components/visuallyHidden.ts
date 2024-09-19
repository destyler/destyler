import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const visuallyHiddenProps = {
  ...primitiveProps,
  /**
   * @default span
   */
  as: {
    ...Primitive.as,
    default: 'span',
  },
} as const

export type VisuallyHiddenProps = ExtractPublicPropTypes<typeof visuallyHiddenProps>

export const VisuallyHidden = defineComponent({
  name: 'DestylerVisuallyHidden',
  props: visuallyHiddenProps,
  setup() {

  },
  render() {
    return h(Primitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      style: {
        position: 'absolute',
        border: 0,
        width: '1px',
        display: 'inline-block',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      },
    }, () => this.$slots.default?.())
  },
})
