import type { SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose, useId } from '@destyler/composition'
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

    rootContext.contentId ||= useId(undefined, 'destyler-tooltip-content')

    const { forwardRef, currentElement: triggerElement } = useForwardExpose()

    const isPointerDown = ref(false)
    const hasPointerMoveOpened = ref(false)

    const tooltipListeners = computed(() => {
      if (rootContext.disabled.value)
        return {}

      return {
        onclick: handleClick,
        onfocus: handleFocus,
        onpointermove: handlePointerMove,
        onpointerleave: handlePointerLeave,
        onpointerdown: handlePointerDown,
        onblur: handleBlur,
      }
    })

    onMounted(() => {
      rootContext.onTriggerChange(triggerElement.value)
    })

    function handlePointerUp() {
      isPointerDown.value = false
    }

    function handlePointerDown() {
      isPointerDown.value = true
      document.addEventListener('pointerup', handlePointerUp, { once: true })
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch')
        return
      if (
        !hasPointerMoveOpened.value && !providerContext.isPointerInTransitRef.value
      ) {
        rootContext.onTriggerEnter()
        hasPointerMoveOpened.value = true
      }
    }

    function handlePointerLeave() {
      rootContext.onTriggerLeave()
      hasPointerMoveOpened.value = false
    }

    function handleFocus(event: FocusEvent) {
      if (isPointerDown.value)
        return

      if (rootContext.ignoreNonKeyboardFocus.value && !(event.target as HTMLElement).matches?.(':focus-visible'))
        return

      rootContext.onOpen()
    }

    function handleBlur() {
      rootContext.onClose()
    }

    function handleClick() {
      if (!rootContext.disableClosingTrigger.value)
        rootContext.onClose()
    }

    return {
      rootContext,
      providerContext,
      forwardRef,
      isPointerDown,
      hasPointerMoveOpened,
      handlePointerDown,
      tooltipListeners,
    }
  },
  render() {
    return h(PopperAnchor, {
      asChild: true,
    }, () => h(Primitive, mergeProps(this.tooltipListeners, {
      'ref': this.forwardRef,
      'aria-describedby': this.rootContext.open.value ? this.rootContext.contentId : undefined,
      'data-state': this.rootContext.stateAttribute.value,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
    }), () => this.$slots.default?.()))
  },
})
