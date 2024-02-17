import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { DestylerToastRootImpl } from './rootImpl'

export const destylerToastRootProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'li',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  type: {
    type: String as PropType<'foreground' | 'background'>,
    required: false,
    default: 'foreground',
  },
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  duration: {
    type: Number as PropType<number>,
    required: false,
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

export type DestylerToastRootProps = ExtractPublicPropTypes<typeof destylerToastRootProps>

export const DestylerToastRoot = defineComponent({
  name: 'DestylerToastRoot',
  props: destylerToastRootProps,
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
    return h(DestylerPresence, {
      present: this.$props.forceMount || this.open,
    }, {
      default: () => {
        return h(DestylerToastRootImpl, {
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
          onSwipeCancel: (event) => {
            const target = event.currentTarget as HTMLElement
            target.setAttribute('data-swipe', 'cancel')
            target.style.removeProperty('--destyler_toast_swipe_move_x')
            target.style.removeProperty('--destyler_toast_swipe_move_y')
            target.style.removeProperty('--destyler_toast_swipe_end_x')
            target.style.removeProperty('--destyler_toast_swipe_end_y')
          },
          onSwipeEnd: (event) => {
            const { x, y } = event.detail.delta
            const target = event.currentTarget as HTMLElement
            target.setAttribute('data-swipe', 'end')
            target.style.removeProperty('--destyler_toast_swipe_move_x')
            target.style.removeProperty('--destyler_toast_swipe_move_y')
            target.style.setProperty('--destyler_toast_swipe_end_x', `${x}px`)
            target.style.setProperty('--destyler_toast_swipe_end_y', `${y}px`)
            this.open = false
          },
        }, {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
