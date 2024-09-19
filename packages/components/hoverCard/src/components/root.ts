import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { PopperRoot } from '@destyler/popper'

export const hoverCardRootProps = {
  /**
   * The controlled open state of the hover card.
   * Can be binded as `v-model:open`.
   *
   * @default undefined
   */
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  /**
   * The open state of the hover card when it is initially rendered.
   * Use when you do not need to control its open state.
   *
   * @default false
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The duration from when the mouse enters the
   * trigger until the hover card opens.
   *
   * @default 700
   */
  openDelay: {
    type: Number as PropType<number>,
    required: false,
    default: 700,
  },
  /**
   * The duration from when the mouse leaves the trigger
   * or content until the hover card closes.
   *
   * @default 300
   */
  closeDelay: {
    type: Number as PropType<number>,
    required: false,
    default: 300,
  },
} as const

export type HoverCardRootProps = ExtractPublicPropTypes<typeof hoverCardRootProps>

export const hoverCardRootEmits = {
  /**
   * Event handler called when the open state of the hover card changes.
   */
  'update:open': (_value: boolean) => true,
}

export interface HoverCardRootContext {
  open: Ref<boolean>
  onOpenChange: (open: boolean) => void
  onOpen: () => void
  onClose: () => void
  onDismiss: () => void
  hasSelectionRef: Ref<boolean>
  isPointerDownOnContentRef: Ref<boolean>
}

export const [injectHoverCardRootContext, provideHoverCardRootContext] = createContext<HoverCardRootContext>('DestylerHoverCardRoot')

export const HoverCardRoot = defineComponent({
  name: 'DestylerHoverCardRoot',
  props: hoverCardRootProps,
  emits: hoverCardRootEmits,
  setup(props, { emit }) {
    const { openDelay, closeDelay } = toRefs(props)

    useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const openTimerRef = ref(0)
    const closeTimerRef = ref(0)
    const hasSelectionRef = ref(false)
    const isPointerDownOnContentRef = ref(false)

    function handleOpen() {
      clearTimeout(closeTimerRef.value)
      openTimerRef.value = window.setTimeout(() => open.value = true, openDelay.value)
    }

    function handleClose() {
      clearTimeout(openTimerRef.value)
      if (!hasSelectionRef.value && !isPointerDownOnContentRef.value)
        closeTimerRef.value = window.setTimeout(() => open.value = false, closeDelay.value)
    }

    function handleDismiss() {
      open.value = false
    }

    provideHoverCardRootContext({
      open,
      onOpenChange(value) {
        open.value = value
      },
      onOpen: handleOpen,
      onClose: handleClose,
      onDismiss: handleDismiss,
      hasSelectionRef,
      isPointerDownOnContentRef,
    })
  },
  render() {
    return h(PopperRoot, {}, () => this.$slots.default?.())
  },
})
