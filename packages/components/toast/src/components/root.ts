import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { ToastRootImpl, toastRootImplEmits, toastRootImplProps } from './rootImpl'

export const toastRootProps = {
  ...toastRootImplProps,
  type: {
    ...toastRootImplProps.type,
    default: 'foreground',
  },
  open: {
    ...toastRootImplProps.open,
    default: undefined,
  },
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

export const toastRootEmits = {
  'escapeKeyDown': toastRootImplEmits.escapeKeyDown,
  'pause': toastRootImplEmits.pause,
  'resume': toastRootImplEmits.resume,
  'swipeStart': toastRootImplEmits.swipeStart,
  'swipeMove': toastRootImplEmits.swipeMove,
  'swipeCancel': toastRootImplEmits.swipeCancel,
  'swipeEnd': toastRootImplEmits.swipeEnd,
  'update:open': (_value: boolean) => true,
}

export const ToastRoot = defineComponent({
  name: 'DestylerToastRoot',
  props: toastRootProps,
  emits: toastRootEmits,
  slots: Object as SlotsType<{
    default: (props: { remaining: number }) => VNode[]
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
