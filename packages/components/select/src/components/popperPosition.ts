import type { SlotsType, VNode } from 'vue'
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
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
        '--destyler-select-content-transform-origin':
        'var(--destyler-popper-transform-origin)',
        '--destyler-select-content-available-width':
        'var(--destyler-popper-available-width)',
        '--destyler-select-content-available-height':
        'var(--destyler-popper-available-height)',
        '--destyler-select-trigger-width': 'var(--destyler-popper-anchor-width)',
        '--destyler-select-trigger-height': 'var(--destyler-popper-anchor-height)',
      },
    }), () => this.$slots.default?.())
  },
})
