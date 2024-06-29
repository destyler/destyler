import type { PropType, Ref } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { ToastRootImpl, toastRootImplProps } from './rootImpl'

export const toastRootProps = {
  ...toastRootImplProps,
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ToastRootProps = ExtractPublicPropTypes<typeof toastRootProps>

export const ToastRoot = defineComponent({
  name: 'DestylerToastRoot',
  props: toastRootProps,
  emits: [
    'escapeKeyDown',
    'pause',
    'resume',
    'swipeStart',
    'swipeMove',
    'swipeCancel',
    'swipeEnd',
    'update:open',
  ],
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
        target.style.setProperty('--destyler_toast_swipe_move_x', `${x}px`)
        target.style.setProperty('--destyler_toast_swipe_move_y', `${y}px`)
      },
      onSwipeCancel: (event: any) => {
        const target = event.currentTarget as HTMLElement
        target.setAttribute('data-swipe', 'cancel')
        target.style.removeProperty('--destyler_toast_swipe_move_x')
        target.style.removeProperty('--destyler_toast_swipe_move_y')
        target.style.removeProperty('--destyler_toast_swipe_end_x')
        target.style.removeProperty('--destyler_toast_swipe_end_y')
      },
      onSwipeEnd: (event: any) => {
        const { x, y } = event.detail.delta
        const target = event.currentTarget as HTMLElement
        target.setAttribute('data-swipe', 'end')
        target.style.removeProperty('--destyler_toast_swipe_move_x')
        target.style.removeProperty('--destyler_toast_swipe_move_y')
        target.style.setProperty('--destyler_toast_swipe_end_x', `${x}px`)
        target.style.setProperty('--destyler_toast_swipe_end_y', `${y}px`)
        this.open = false
      },
    }, () => this.$slots.default?.()))
  },
})
