import type { PropType, Ref } from 'vue'
import { defineComponent, ref, toRefs } from 'vue'
import { createContext } from '@destyler/shared'
import { useTimeoutFn } from '@destyler/composition'

export const destylerTooltipProviderProps = {
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
}

export interface TooltipProviderContext {
  isOpenDelayed: Ref<boolean>
  delayDuration: Ref<number>
  onOpen(): void
  onClose(): void
  onPointerInTransitChange(inTransit: boolean): void
  isPointerInTransitRef: Ref<boolean>
  disableHoverableContent: Ref<boolean>
  disableClosingTrigger: Ref<boolean>
}

export const [injectTooltipProviderContext, provideTooltipProviderContext]
  = createContext<TooltipProviderContext>('DestylerTooltipProvider')

export const DestylerTooltipProvider = defineComponent({
  name: 'DestylerTooltipProvider',
  props: destylerTooltipProviderProps,
  setup(props) {
    const { delayDuration, skipDelayDuration, disableHoverableContent, disableClosingTrigger } = toRefs(props)

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
      onPointerInTransitChange(inTransit) {
        isPointerInTransitRef.value = inTransit
      },
      disableHoverableContent,
      disableClosingTrigger,
    })
  },
  render() {
    return this.$slots.default?.()
  },
})
