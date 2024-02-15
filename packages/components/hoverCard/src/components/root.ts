import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { DestylerPopperRoot } from '@destyler/popper'

export const destylerHoverCardRootProps = {
  open: {
    type: Boolean as PropType<boolean>,
    required: undefined,
  },
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  openDelay: {
    type: Number as PropType<number>,
    required: false,
    default: 700,
  },
  closeDelay: {
    type: Number as PropType<number>,
    required: false,
    default: 300,
  },
} as const

export type DestylerHoverCardRootProps = ExtractPublicPropTypes<typeof destylerHoverCardRootProps>

export interface HoverCardRootContext {
  open: Ref<boolean>
  onOpenChange(open: boolean): void
  onOpen(): void
  onClose(): void
  onDismiss(): void
  hasSelectionRef: Ref<boolean>
  isPointerDownOnContentRef: Ref<boolean>
}

export const [injectHoverCardRootContext, provideHoverCardRootContext] = createContext<HoverCardRootContext>('HoverCardRoot')

export const DestylerHoverCardRoot = defineComponent({
  name: 'DestylerHoverCardRoot',
  props: destylerHoverCardRootProps,
  emits: ['update:open'],
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
    return h(DestylerPopperRoot, {}, {
      default: () => this.$slots.default?.(),
    })
  },
})
