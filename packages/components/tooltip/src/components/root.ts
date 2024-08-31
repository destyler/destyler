import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, ref, watch } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useTimeoutFn, useVModel } from '@destyler/composition'
import { PopperRoot } from '@destyler/popper'

import { TOOLTIP_OPEN } from '../utils'
import { injectTooltipProviderContext } from './provider'

export const tooltipRootProps = {
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  delayDuration: {
    type: Number as PropType<number>,
    required: false,
    default: 400,
  },
  disableHoverableContent: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  disableClosingTrigger: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  ignoreNonKeyboardFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
} as const

export type TooltipRootProps = ExtractPublicPropTypes<typeof tooltipRootProps>

export const tooltipRootEmits = {
  'update:open': (_value: boolean) => true,
}

export interface TooltipContext {
  contentId: string
  open: Ref<boolean>
  stateAttribute: Ref<'closed' | 'delayed-open' | 'instant-open'>
  trigger: Ref<HTMLElement | undefined>
  onTriggerChange: (trigger: HTMLElement | undefined) => void
  onTriggerEnter: () => void
  onTriggerLeave: () => void
  onOpen: () => void
  onClose: () => void
  disableHoverableContent: Ref<boolean>
  disableClosingTrigger: Ref<boolean>
  disabled: Ref<boolean>
  ignoreNonKeyboardFocus: Ref<boolean>
}

export const [injectTooltipRootContext, provideTooltipRootContext] = createContext<TooltipContext>('DestylerTooltipRoot')

export const TooltipRoot = defineComponent({
  name: 'DestylerTooltipRoot',
  props: tooltipRootProps,
  emits: tooltipRootEmits,

  setup(props, { emit }) {
    useForwardExpose()
    const providerContext = injectTooltipProviderContext()

    const disableHoverableContent = computed(() => props.disableHoverableContent ?? providerContext.disableHoverableContent.value)
    const disableClosingTrigger = computed(() => props.disableClosingTrigger ?? providerContext.disableClosingTrigger.value)
    const disableTooltip = computed(() => props.disabled ?? providerContext.disabled.value)

    const delayDuration = computed(() => props.delayDuration ?? providerContext.delayDuration.value)
    const ignoreNonKeyboardFocus = computed(() => props.ignoreNonKeyboardFocus ?? providerContext.ignoreNonKeyboardFocus.value)

    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    watch(open, (isOpen) => {
      if (!providerContext.onClose)
        return
      if (isOpen) {
        providerContext.onOpen()
        // as `onChange` is called within a lifecycle method we
        // avoid dispatching via `dispatchDiscreteCustomEvent`.
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN))
      }
      else {
        providerContext.onClose()
      }
    })

    const wasOpenDelayedRef = ref(false)
    const trigger = ref<HTMLElement>()

    const stateAttribute = computed(() => {
      if (!open.value)
        return 'closed'
      return wasOpenDelayedRef.value ? 'delayed-open' : 'instant-open'
    })

    const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
      wasOpenDelayedRef.value = true
      open.value = true
    }, delayDuration, { immediate: false })

    function handleOpen() {
      clearTimer()
      wasOpenDelayedRef.value = false
      open.value = true
    }
    function handleClose() {
      clearTimer()
      open.value = false
    }
    function handleDelayedOpen() {
      startTimer()
    }

    provideTooltipRootContext({
      contentId: '',
      open,
      stateAttribute,
      trigger,
      onTriggerChange(el) {
        trigger.value = el
      },
      onTriggerEnter() {
        if (providerContext.isOpenDelayed.value)
          handleDelayedOpen()
        else handleOpen()
      },
      onTriggerLeave() {
        if (disableHoverableContent.value) {
          handleClose()
        }
        else {
          // Clear the timer in case the pointer leaves the trigger before the tooltip is opened.
          clearTimer()
        }
      },
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      disableClosingTrigger,
      disabled: disableTooltip,
      ignoreNonKeyboardFocus,
    })
  },
  render() {
    return h(PopperRoot, null, () => this.$slots.default?.())
  },
})
