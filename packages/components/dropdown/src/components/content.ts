import { defineComponent, h, mergeProps, ref, withDirectives } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerMenuContent, destylerMenuContentProps } from '@destyler/menu'

import { BindOnceDirective } from '@destyler/directives'
import { injectDropdownMenuRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerDropdownContentProps = {
  ...destylerMenuContentProps,
} as const

export type DestylerDropdownContentProps = ExtractPublicPropTypes<typeof destylerDropdownContentProps>

export const DestylerDropdownContent = defineComponent({
  name: 'DestylerDropdownContent',
  props: destylerDropdownContentProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'entryFocus'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    const rootContext = injectDropdownMenuRootContext()

    const hasInteractedOutsideRef = ref(false)

    function handleCloseAutoFocus(event: Event) {
      if (event.defaultPrevented)
        return
      if (!hasInteractedOutsideRef.value) {
        setTimeout(() => {
          rootContext.triggerElement.value?.focus()
        }, 0)
      }
      hasInteractedOutsideRef.value = false

      event.preventDefault()
    }

    return {
      forwarded,
      rootContext,
      hasInteractedOutsideRef,
      handleCloseAutoFocus,
    }
  },
  render() {
    return withDirectives(h(DestylerMenuContent, mergeProps(this.$props, {
      'aria-labelledby': this.rootContext?.triggerId,
      'style': {
        '--destyler_dropdown_menu_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_dropdown_menu_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_dropdown_menu_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_dropdown_menu_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_dropdown_menu_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
      'onCloseAutoFocus': (event: any) => {
        this.handleCloseAutoFocus(event)
      },
      'onInteractOutside': (event: any) => {
        if (event.defaultPrevented)
          return

        const originalEvent = event.detail.originalEvent as PointerEvent
        const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
        const isRightClick = originalEvent.button === 2 || ctrlLeftClick
        if (!this.rootContext.modal.value || isRightClick)
          this.hasInteractedOutsideRef = true
        if (this.rootContext.triggerElement.value?.contains(event.target as HTMLElement))
          event.preventDefault()
      },
    }), () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ])
  },
})
