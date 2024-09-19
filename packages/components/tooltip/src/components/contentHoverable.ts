import { defineComponent, h, mergeProps } from 'vue'
import { useForwardExpose, useForwardProps, useGraceArea } from '@destyler/composition'

import { injectTooltipRootContext } from './root'
import { injectTooltipProviderContext } from './provider'
import { TooltipContentImpl, tooltipContentImplProps } from './contentImpl'

export const TooltipContentHoverable = defineComponent({
  name: 'DestylerTooltipContentHoverable',
  props: tooltipContentImplProps,
  setup(props) {
    const forwardedProps = useForwardProps(props)
    const { forwardRef, currentElement } = useForwardExpose()

    const { trigger, onClose } = injectTooltipRootContext()
    const providerContext = injectTooltipProviderContext()

    const { isPointerInTransit, onPointerExit } = useGraceArea(trigger, currentElement)

    providerContext.isPointerInTransitRef = isPointerInTransit
    onPointerExit(() => {
      onClose()
    })
    return {
      forwardRef,
      forwardedProps,
    }
  },
  render() {
    return h(TooltipContentImpl, mergeProps(this.forwardedProps, {
      ref: this.forwardRef,
    }), () => this.$slots.default?.())
  },
})
