import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardProps } from '@destyler/composition'
import { TooltipProvider, tooltipProviderProps } from '@destyler/tooltip'

export const ellipsisProviderProps = {
  ...tooltipProviderProps,
} as const

export type EllipsisProviderProps = ExtractPublicPropTypes<typeof ellipsisProviderProps>

export const EllipsisProvider = defineComponent({
  name: 'DestylerEllipsisProvider',
  props: ellipsisProviderProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props) {
    const forward = useForwardProps(props)
    useForwardExpose()

    return {
      forward,
    }
  },
  render() {
    return h(TooltipProvider, this.forward, () => this.$slots.default?.())
  },
})
