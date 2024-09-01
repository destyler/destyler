import type { PropType, Ref } from 'vue'
import { defineComponent, ref, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useTimeoutFn } from '@destyler/composition'

export const tooltipProviderProps = {
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened.
   *
   * @defaultValue 700
   */
  delayDuration: {
    type: Number as PropType<number>,
    required: false,
    default: 700,
  },
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   *
   * @defaultValue 300
   */
  skipDelayDuration: {
    type: Number as PropType<number>,
    required: false,
    default: 300,
  },
  /**
   * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   *
   * @defaultValue false
   */
  disableHoverableContent: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true`, clicking on trigger will not close the content.
   *
   * @defaultValue false
   */
  disableClosingTrigger: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true`, disable tooltip
   *
   * @defaultValue false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * Prevent the tooltip from opening if the focus did not come from
   * the keyboard by matching against the `:focus-visible` selector.
   * This is useful if you want to avoid opening it when switching
   * browser tabs or closing a dialog.
   *
   * @defaultValue false
   */
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
