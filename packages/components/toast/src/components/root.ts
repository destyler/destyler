import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { ToastRootImpl, toastRootImplEmits, toastRootImplProps } from './rootImpl'

export const toastRootProps = {
  ...toastRootImplProps,
  /**
   * Control the sensitivity of the toast for accessibility purposes.
   *
   * For toasts that are the result of a user action, choose `foreground`. Toasts generated from background tasks should use `background`.
   *
   * @default foreground
   */
  type: {
    ...toastRootImplProps.type,
    default: 'foreground',
  },
  /**
   * The controlled open state of the dialog. Can be bind as `v-model:open`.
   *
   * @default undefined
   */
  open: {
    ...toastRootImplProps.open,
    default: undefined,
  },
  /**
   * The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.
   *
   * @default true
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Vue animation libraries.
   */
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ToastRootProps = ExtractPublicPropTypes<typeof toastRootProps>

export const toastRootEmits = {
  /**
   * Event handler called when the escape key is down. It can be prevented by calling `event.preventDefault`.
   */
  'escapeKeyDown': toastRootImplEmits.escapeKeyDown,
  /**
   * Event handler called when the dismiss timer is paused. This occurs when the pointer is moved over the viewport, the viewport is focused or when the window is blurred.
   */
  'pause': toastRootImplEmits.pause,
  /**
   * Event handler called when the dismiss timer is resumed. This occurs when the pointer is moved away from the viewport, the viewport is blurred or when the window is focused.
   */
  'resume': toastRootImplEmits.resume,
  /**
   * Event handler called when starting a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  'swipeStart': toastRootImplEmits.swipeStart,
  /**
   * Event handler called during a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  'swipeMove': toastRootImplEmits.swipeMove,
  'swipeCancel': toastRootImplEmits.swipeCancel,
  /**
   * Event handler called at the end of a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  'swipeEnd': toastRootImplEmits.swipeEnd,
  /**
   * Event handler called when the open state changes
   */
  'update:open': (_value: boolean) => true,
}

export const ToastRoot = defineComponent({
  name: 'DestylerToastRoot',
  props: toastRootProps,
  emits: toastRootEmits,
  slots: Object as SlotsType<{
    default: (props: {
      /**
       * Remaining time (in ms)
       */
      remaining: number
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    const { forwardRef } = useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    return {
      forwardRef,
      open,
    }
  },
  render() {
    return h(Presence, {
      present: this.$props.forceMount || this.open,
    }, () => h(ToastRootImpl, {
      ref: (el: any) => this.forwardRef(el),
      open: this.open,
      type: this.$props.type,
      as: this.$props.as,
      asChild: this.$props.asChild,
      duration: this.$props.duration,
      onClose: () => {
        this.open = false
      },
      onPause: () => {
        this.$emit('pause')
      },
      onResume: () => {
        this.$emit('resume')
      },
      onEscapeKeyDown: (event: any) => {
        this.$emit('escapeKeyDown', event)
      },
      onSwipeStart: (event: any) => {
        this.$emit('swipeStart', event);
        (event.currentTarget as HTMLElement).setAttribute('data-swipe', 'start')
      },
      onSwipeMove: (event: any) => {
        const { x, y } = event.detail.delta
        const target = event.currentTarget as HTMLElement
        target.setAttribute('data-swipe', 'move')
        target.style.setProperty('--destyler-toast-swipe-move-x', `${x}px`)
        target.style.setProperty('--destyler-toast-swipe-move-y', `${y}px`)
      },
      onSwipeCancel: (event: any) => {
        const target = event.currentTarget as HTMLElement
        target.setAttribute('data-swipe', 'cancel')
        target.style.removeProperty('--destyler-toast-swipe-move-x')
        target.style.removeProperty('--destyler-toast-swipe-move-y')
        target.style.removeProperty('--destyler-toast-swipe-end-x')
        target.style.removeProperty('--destyler-toast-swipe-end-y')
      },
      onSwipeEnd: (event: any) => {
        const { x, y } = event.detail.delta
        const target = event.currentTarget as HTMLElement
        target.setAttribute('data-swipe', 'end')
        target.style.removeProperty('--destyler-toast-swipe-move-x')
        target.style.removeProperty('--destyler-toast-swipe-move-y')
        target.style.setProperty('--destyler-toast-swipe-end-x', `${x}px`)
        target.style.setProperty('--destyler-toast-swipe-end-y', `${y}px`)
        this.open = false
      },
    }, {
      default: (props: { remaining: number }) => this.$slots.default?.({ remaining: props.remaining }),
    }))
  },
})
