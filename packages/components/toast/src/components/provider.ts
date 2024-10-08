import type { PropType, Ref } from 'vue'
import { defineComponent, ref, toRefs } from 'vue'
import { createContext } from '@destyler/shared'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import type { SwipeDirection } from '../utils'

export const toastProviderProps = {
  /**
   * An author-localized label for each toast.
   * Used to help screen reader users
   * associate the interruption with a toast.
   *
   * @default Notification
   */
  label: {
    type: String as PropType<string>,
    required: false,
    default: 'Notification',
  },
  /**
   * Time in milliseconds that each toast should remain visible for.
   *
   * @default 5000
   */
  duration: {
    type: Number as PropType<number>,
    required: false,
    default: 5000,
  },
  /**
   * Direction of pointer swipe that should close the toast.
   *
   * @default 'right'
   */
  swipeDirection: {
    type: String as PropType<SwipeDirection>,
    required: false,
    default: 'right',
  },
  /**
   * Distance in pixels that the swipe must pass before a close is triggered.
   *
   * @default 50
   */
  swipeThreshold: {
    type: Number as PropType<number>,
    required: false,
    default: 50,
  },
} as const

export type ToastProviderProps = ExtractPublicPropTypes<typeof toastProviderProps>

export interface ToastProviderContext {
  label: Ref<string>
  duration: Ref<number>
  swipeDirection: Ref< SwipeDirection>
  swipeThreshold: Ref<number>
  toastCount: Ref<number>
  viewport: Ref<HTMLElement | undefined>
  onViewportChange: (viewport: HTMLElement) => void
  onToastAdd: () => void
  onToastRemove: () => void
  isFocusedToastEscapeKeyDownRef: Ref<boolean>
  isClosePausedRef: Ref<boolean>
}

export const [injectToastProviderContext, provideToastProviderContext] = createContext<ToastProviderContext>('DestylerToastProvider')

export const ToastProvider = defineComponent({
  name: 'DestylerToastProvider',
  props: toastProviderProps,
  setup(props) {
    const { label, duration, swipeDirection, swipeThreshold } = toRefs(props)

    const viewport = ref<HTMLElement>()
    const toastCount = ref(0)
    const isFocusedToastEscapeKeyDownRef = ref(false)
    const isClosePausedRef = ref(false)

    if (props.label && typeof props.label === 'string' && !props.label.trim()) {
      const error = 'Invalid prop `label` supplied to `DestylerToastProvider`. Expected non-empty `string`.'
      throw new Error(error)
    }

    provideToastProviderContext({
      label,
      duration,
      swipeDirection,
      swipeThreshold,
      toastCount,
      viewport,
      onViewportChange(el) {
        viewport.value = el
      },
      onToastAdd() {
        toastCount.value++
      },
      onToastRemove() {
        toastCount.value--
      },
      isFocusedToastEscapeKeyDownRef,
      isClosePausedRef,

    })
  },
  render() {
    return this.$slots.default?.()
  },
})
