import type { PropType, Ref, SlotsType } from 'vue'
import { computed, defineComponent, h, ref, watch } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useId, useTimeoutFn, useVModel } from '@destyler/composition'
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
}

export const [injectTooltipRootContext, provideTooltipRootContext] = createContext<TooltipContext>('DestylerTooltipRoot')

export const TooltipRoot = defineComponent({
  name: 'DestylerTooltipRoot',
  props: tooltipRootProps,
  emits: tooltipRootEmits,
  slots: Object as SlotsType<{
    default: () => void
  }>,
  setup(props, { emit }) {
    const providerContext = injectTooltipProviderContext()

    const disableHoverableContent = computed(() => {
      return props.disableHoverableContent ?? providerContext.disableHoverableContent.value
    })
    const disableClosingTrigger = computed(() => props.disableClosingTrigger ?? providerContext.disableClosingTrigger.value)
    const delayDuration = computed(() => props.delayDuration ?? providerContext.delayDuration.value)

    const openRef = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    watch(openRef, (isOpen) => {
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
      if (!openRef.value)
        return 'closed'
      return wasOpenDelayedRef.value ? 'delayed-open' : 'instant-open'
    })

    const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
      wasOpenDelayedRef.value = true
      openRef.value = true
    }, delayDuration, { immediate: false })

    function handleOpen() {
      clearTimer()
      wasOpenDelayedRef.value = false
      openRef.value = true
    }
    function handleClose() {
      clearTimer()
      openRef.value = false
    }
    function handleDelayedOpen() {
      startTimer()
    }

    provideTooltipRootContext({
      contentId: useId(),
      open: openRef,
      stateAttribute,
      trigger,
      onTriggerChange(el) {
        trigger.value = el
      },
      onTriggerEnter() {
        if (providerContext.isOpenDelayed.value)
          handleDelayedOpen()
        else
          handleOpen()
      },
      onTriggerLeave() {
        if (disableHoverableContent.value)
          handleClose()
        else
          clearTimer()
      },
      onOpen: handleOpen,
      onClose: handleClose,
      disableHoverableContent,
      disableClosingTrigger,
    })
  },
  render() {
    return h(PopperRoot, null, () => this.$slots.default?.())
  },
})
