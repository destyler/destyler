import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerVisuallyhiddenProps = {
  ...destylerPrimitiveProps,
  as: {
    ...DestylerPrimitive.as,
    default: 'span',
  },
} as const

export type DestylerVisuallyhiddenProps = ExtractPublicPropTypes<typeof destylerVisuallyhiddenProps>

export const DestylerVisuallyhidden = defineComponent({
  name: 'DestylerVisuallyhidden',
  props: destylerVisuallyhiddenProps,
  setup() {

  },
  render() {
    return h(DestylerPrimitive, {
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
