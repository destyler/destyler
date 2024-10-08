import { defineComponent, h, mergeProps, withDirectives } from 'vue'
import { useFocusGuards, useForwardProps } from '@destyler/composition'
import { PopperContent, popperContentProps } from '@destyler/popper'
import { DismissableLayer, dismissableLayerProps } from '@destyler/dismissable-layer'
import { dismissableLayerEmits } from '@destyler/dismissable-layer/component'
import { FocusScope, focusScopeProps } from '@destyler/focus-scope'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectPopoverRootContext } from './root'

export const popoverContentImplProps = {
  ...popperContentProps,
  ...dismissableLayerProps,
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Vue animation libraries.
   */
  trapFocus: {
    ...focusScopeProps.trapped,
  },
} as const

export type PopoverContentImplProps = ExtractPublicPropTypes<typeof popoverContentImplProps>

export const popoverContentImplEmits = {
  ...dismissableLayerEmits,
  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  openAutoFocus: (_event: Event) => true,
  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  closeAutoFocus: (_event: Event) => true,
}

export const PopoverContentImpl = defineComponent({
  name: 'DestylerPopoverContentImpl',
  props: popoverContentImplProps,
  emits: popoverContentImplEmits,
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
        '--destyler-popover-content-transform-origin': 'var(--destyler-popper-transform-origin)',
        '--destyler-popover-content-available-width': 'var(--destyler-popper-available-width)',
        '--destyler-popover-content-available-height': 'var(--destyler-popper-available-height)',
        '--destyler-popover-trigger-width': 'var(--destyler-popper-anchor-width)',
        '--destyler-popover-trigger-height': 'var(--destyler-popper-anchor-height)',
      },
    }), () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ])))
  },
})
