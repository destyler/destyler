import { defineComponent, h, mergeProps } from 'vue'
import { PopperContent, popperContentProps } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardProps } from '@destyler/composition'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const selectPopperPositionProps = {
  ...popperContentProps,
} as const

export type SelectPopperPositionProps = ExtractPublicPropTypes<typeof selectPopperPositionProps>

export const SelectPopperPosition = defineComponent({
  name: 'DestylerSelectPopperPosition',
  props: selectPopperPositionProps,
  setup(props) {
    const forwarded = useForwardProps(props)
    return {
      forwarded,
    }
  },
  render() {
    return h(PopperContent, mergeProps(this.forwarded, {
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
