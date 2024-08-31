import { defineComponent, h, mergeProps, ref, withDirectives } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { MenuContent, menuContentProps } from '@destyler/menu'
import { menuContentEmits } from '@destyler/menu/component'

import { BindOnceDirective } from '@destyler/directives'
import { injectDropdownMenuRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const dropdownContentProps = {
  ...menuContentProps,
} as const

export type DropdownContentProps = ExtractPublicPropTypes<typeof dropdownContentProps>

export const dropdownContentEmits = {
  ...menuContentEmits,
}

export const DropdownContent = defineComponent({
  name: 'DestylerDropdownContent',
  props: dropdownContentProps,
  emits: dropdownContentEmits,

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
    return withDirectives(h(MenuContent, mergeProps(this.$props, {
      'aria-labelledby': this.rootContext?.triggerId,
      'style': {
        '--destyler-dropdown-content-transform-origin': 'var(--destyler-popper-transform-origin)',
        '--destyler-dropdown-content-available-width': 'var(--destyler-popper-available-width)',
        '--destyler-dropdown-content-available-height': 'var(--destyler-popper-available-height)',
        '--destyler-dropdown-trigger-width': 'var(--destyler-popper-anchor-width)',
        '--destyler-dropdown-trigger-height': 'var(--destyler-popper-anchor-height)',
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
