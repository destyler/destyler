import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, withDirectives } from 'vue'
import { useFocusGuards, useForwardProps } from '@destyler/composition'
import { PopperContent, popperContentProps } from '@destyler/popper'
import { DismissableLayer, dismissableLayerProps } from '@destyler/dismissable-layer'
import { dismissableLayerEmits } from '@destyler/dismissable-layer/dist/component'
import { FocusScope, focusScopeProps } from '@destyler/focus-scope'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectPopoverRootContext } from './root'

export const popoverContentImplProps = {
  ...popperContentProps,
  ...dismissableLayerProps,
  trapFocus: {
    ...focusScopeProps.trapped,
  },
} as const

export type PopoverContentImplProps = ExtractPublicPropTypes<typeof popoverContentImplProps>

// ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'openAutoFocus', 'closeAutoFocus']
export const popoverContentImplEmits = {
  ...dismissableLayerEmits,
  openAutoFocus: (_event: Event) => true,
  closeAutoFocus: (_event: Event) => true,
}

export const PopoverContentImpl = defineComponent({
  name: 'DestylerPopoverContentImpl',
  props: popoverContentImplProps,
  emits: popoverContentImplEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
    return h(FocusScope, {
      asChild: true,
      loop: true,
      trapped: this.$props.trapFocus,
      onMountAutoFocus: (event) => {
        this.$emit('openAutoFocus', event)
      },
      onUnmountAutoFocus: (event) => {
        this.$emit('closeAutoFocus', event)
      },
    }, () => h(DismissableLayer, {
      asChild: true,
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
    }, () => withDirectives(h(PopperContent, mergeProps(this.forwarded, {
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'role': 'dialog',
      'style': {
        '--destyler_popover_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_popover_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_popover_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_popover_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_popover_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }), () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ])))
  },
})
