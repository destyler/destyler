import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, onMounted, ref } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import { PopperAnchor } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectTooltipRootContext } from './root'
import { injectTooltipProviderContext } from './provider'

export type TooltipTriggerDataState = | 'closed' | 'delayed-open' | 'instant-open'

export const tooltipTriggerProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type TooltipTriggerProps = ExtractPublicPropTypes<typeof tooltipTriggerProps>

export const TooltipTrigger = defineComponent({
  name: 'DestylerTooltipTrigger',
  props: tooltipTriggerProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContext = injectTooltipRootContext()
    const providerContext = injectTooltipProviderContext()

    const { forwardRef, currentElement: triggerElement } = useForwardExpose()

    const isPointerDown = ref(false)
    const hasPointerMoveOpened = ref(false)

    function handlePointerUp() {
      isPointerDown.value = false
    }

    function handlePointerDown() {
      isPointerDown.value = true
      document.addEventListener('pointerup', handlePointerUp, { once: true })
    }

    onMounted(() => {
      rootContext.onTriggerChange(triggerElement.value)
    })

    return {
      rootContext,
      providerContext,
      forwardRef,
      isPointerDown,
      hasPointerMoveOpened,
      handlePointerDown,
    }
  },
  render() {
    return h(PopperAnchor, {
      asChild: true,
    }, () => h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'aria-describedby': this.rootContext.open.value ? this.rootContext.contentId : undefined,
      'data-state': this.rootContext.stateAttribute.value,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'onPointermove': (event: any) => {
        if (event.pointerType === 'touch')
          return
        if (!this.hasPointerMoveOpened && !this.providerContext.isPointerInTransitRef.value) {
          this.rootContext.onTriggerEnter()
          this.hasPointerMoveOpened = true
        }
      },
      'onPointerleave': () => {
        this.rootContext.onTriggerLeave()
        this.hasPointerMoveOpened = false
      },
      'onPointerdown': () => {
        this.handlePointerDown()
      },
      'onFocus': () => {
        if (!this.isPointerDown)
          this.rootContext.onOpen()
      },
      'onBlur': () => {
        this.rootContext.onClose()
      },
      'onClick': () => {
        if (!this.rootContext.disableClosingTrigger.value)
          this.rootContext.onClose()
      },
    }, () => this.$slots.default?.()))
  },
})
