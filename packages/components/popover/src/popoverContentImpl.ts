import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, withDirectives } from 'vue'
import { useFocusGuards, useForwardProps } from '@destyler/composition'
import { DestylerPopperContent, destylerPopperContentProps } from '@destyler/popper'
import { DestylerDismissableLayer, destylerDismissableLayerProps } from '@destyler/dismissable-layer'
import { DestylerFocusScope } from '@destyler/focus-scope'
import { BindOnceDirective } from '@destyler/directives'

import { injectPopoverRootContext } from './popoverRoot'

export const destylerPopoverContentImplProps = {
  ...destylerPopperContentProps,
  ...destylerDismissableLayerProps,
  trapFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
}

export const destylerPopoverContentImplEmits = ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'openAutoFocus', 'closeAutoFocus']

export const DestylerPopoverContentImpl = defineComponent({
  name: 'DestylerPopoverContentImpl',
  props: destylerPopoverContentImplProps,
  emits: destylerPopoverContentImplEmits,
  setup(props) {
    const forwarded = useForwardProps(props)
    const rootContext = injectPopoverRootContext()
    useFocusGuards()

    return {
      rootContext,
      forwarded,
    }
  },
  render() {
    return h(DestylerFocusScope, {
      asChild: this.$props.asChild,
      loop: true,
      trapped: this.$props.trapFocus,
      onMountAutoFocus: (event) => {
        this.$emit('openAutoFocus', event)
      },
      onUnmountAutoFocus: (event) => {
        this.$emit('closeAutoFocus', event)
      },
    }, h(DestylerDismissableLayer, {
      asChild: this.$props.asChild,
      disableOutsidePointerEvents: this.$props.disableOutsidePointerEvents,
      onPointerDownOutside: (event) => {
        this.$emit('pointerDownOutside', event)
      },
      onInteractOutside: (event) => {
        this.$emit('interactOutside', event)
      },
      onEscapeKeyDown: (event) => {
        this.$emit('escapeKeyDown', event)
      },
      onFocusOutside: (event) => {
        this.$emit('focusOutside', event)
      },
      onDismiss: () => {
        this.rootContext.onOpenChange(false)
      },
    }, withDirectives(h(DestylerPopperContent, {
      ...mergeProps(this.forwarded),
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'role': 'dialog',
      'style': {
        '--destyler_popover_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_popover_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_popover_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_popover_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_popover_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }, this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ])))
  },
})
