import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, ref, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useTimeoutFn } from '@destyler/composition'

export const tooltipProviderProps = {
  delayDuration: {
    type: Number as PropType<number>,
    required: false,
    default: 700,
  },
  skipDelayDuration: {
    type: Number as PropType<number>,
    required: false,
    default: 300,
  },
  disableHoverableContent: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disableClosingTrigger: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  ignoreNonKeyboardFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type TooltipProviderProps = ExtractPublicPropTypes<typeof tooltipProviderProps>

export interface TooltipProviderContext {
  isOpenDelayed: Ref<boolean>
  delayDuration: Ref<number>
  onOpen: () => void
  onClose: () => void
  isPointerInTransitRef: Ref<boolean>
  disableHoverableContent: Ref<boolean>
  disableClosingTrigger: Ref<boolean>
  disabled: Ref<boolean>
  ignoreNonKeyboardFocus: Ref<boolean>
}

export const [injectTooltipProviderContext, provideTooltipProviderContext]
  = createContext<TooltipProviderContext>('DestylerTooltipProvider')

export const TooltipProvider = defineComponent({
  name: 'DestylerTooltipProvider',
  inheritAttrs: false,
  props: tooltipProviderProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props) {
    const { delayDuration, skipDelayDuration, disableHoverableContent, disableClosingTrigger, ignoreNonKeyboardFocus, disabled } = toRefs(props)
    useForwardExpose()

    const isOpenDelayed = ref(true)
    const isPointerInTransitRef = ref(false)

    const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
      isOpenDelayed.value = true
    }, skipDelayDuration, { immediate: false })

    provideTooltipProviderContext({
      isOpenDelayed,
      delayDuration,
      onOpen() {
        clearTimer()
        isOpenDelayed.value = false
      },
      onClose() {
        startTimer()
      },
      isPointerInTransitRef,
      disableHoverableContent,
      disableClosingTrigger,
      disabled,
      ignoreNonKeyboardFocus,
    })
  },
  render() {
    return this.$slots.default?.()
  },
})
