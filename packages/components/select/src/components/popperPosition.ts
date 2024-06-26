import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPopperContent, destylerPopperContentProps } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardProps } from '@destyler/composition'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerSelectPopperPositionProps = {
  ...destylerPopperContentProps,
} as const

export type DestylerSelectPopperPositionProps = ExtractPublicPropTypes<typeof destylerSelectPopperPositionProps>

export const DestylerSelectPopperPosition = defineComponent({
  name: 'DestylerSelectPopperPosition',
  props: destylerSelectPopperPositionProps,
  setup(props) {
    const forwarded = useForwardProps(props)
    return {
      forwarded,
    }
  },
  render() {
    return h(DestylerPopperContent, mergeProps(this.forwarded, {
      style: {
        'boxSizing': 'border_box',
        '--destyler_select_content_transform_origin':
        'var(--destyler_popper_transform_origin)',
        '--destyler_select_content_available_width':
        'var(--destyler_popper_available_width)',
        '--destyler_select_content_available_height':
        'var(--destyler_popper_available_height)',
        '--destyler_select_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_select_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }), () => this.$slots.default?.())
  },
})
