import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, onMounted } from 'vue'
import { useForwardExpose, useForwardProps } from '@destyler/composition'
import { type ExtractPublicPropTypes, createContext } from '@destyler/shared'
import { TooltipTrigger, tooltipTriggerProps } from '@destyler/tooltip'

import { injectEllipsisRootContext } from './root'

export type EllipsisTriggerDataState = | 'closed' | 'delayed-open' | 'instant-open'

export const ellipsisTriggerProps = {
  ...tooltipTriggerProps,
  as: {
    ...tooltipTriggerProps.as,
    default: 'span',
  },
} as const

export type EllipsisTriggerProps = ExtractPublicPropTypes<typeof ellipsisTriggerProps>

export interface EllipsisTriggerContent {
  text: string
}

export const [injectEllipsisTriggerContext, provideEllipsisTriggerContext] = createContext<EllipsisTriggerContent>('DestylerEllipsisTriggerContent')

export const EllipsisTrigger = defineComponent({
  name: 'DestylerEllipsisTrigger',
  props: ellipsisTriggerProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props) {
    const rootContext = injectEllipsisRootContext()
    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    onMounted(() => {
      rootContext.onSetText(triggerElement.value?.textContent ?? '')
    })

    const forward = useForwardProps(props)

    return {
      rootContext,
      forward,
      forwardRef,
    }
  },
  render() {
    return h(TooltipTrigger, mergeProps(this.forward, {
      ref: this.forwardRef,
      style: {
        'white-space': 'nowrap',
        'display': 'inline-block',
        'vertical-align': 'bottom',
        'text-overflow': 'ellipsis',
        'overflow': 'hidden',
      },
    }), () => this.$slots.default?.())
  },
})
