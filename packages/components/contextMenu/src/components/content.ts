import { defineComponent, h, mergeProps, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { MenuContent, menuContentProps } from '@destyler/menu'
import { menuContentEmits } from '@destyler/menu/component'

import { injectContextMenuRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const

export type Side = (typeof SIDE_OPTIONS)[number]

export const contextMenuContentProps = {
  as: {
    ...menuContentProps.as,
  },
  asChild: {
    ...menuContentProps.asChild,
  },
  alignOffset: {
    ...menuContentProps.alignOffset,
    default: 0,
  },
  avoidCollisions: {
    ...menuContentProps.avoidCollisions,
    default: true,
  },
  collisionBoundary: {
    ...menuContentProps.collisionBoundary,
    default: () => [],
  },
  collisionPadding: {
    ...menuContentProps.collisionPadding,
    default: 0,
  },
  sticky: {
    ...menuContentProps.sticky,
    default: 'partial',
  },
  hideWhenDetached: {
    ...menuContentProps.hideWhenDetached,
    default: false,
  },
  prioritizePosition: {
    ...menuContentProps.prioritizePosition,
    default: false,
  },
  loop: {
    ...menuContentProps.loop,
  },
  forceMount: {
    ...menuContentProps.forceMount,
  },
} as const

export type ContextMenuContentProps = ExtractPublicPropTypes<typeof contextMenuContentProps>

export const contextMenuContentEmits = {
  ...menuContentEmits,
}

export const ContextMenuContent = defineComponent({
  name: 'DestylerContextMenuContent',
  props: contextMenuContentProps,
  emits: contextMenuContentEmits,

  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    useForwardExpose()
    const rootContext = injectContextMenuRootContext()
    const hasInteractedOutside = ref(false)

    return {
      forwarded,
      rootContext,
      hasInteractedOutside,
    }
  },
  render() {
    return h(MenuContent, mergeProps(this.forwarded, {
      side: 'right',
      sideOffset: 2,
      align: 'start',
      style: {
        '--destyler-context-menu-content-transform-origin': 'var(--destyler-popper-transform-origin)',
        '--destyler-context-menu-content-available-width': 'var(--destyler-popper-available-width)',
        '--destyler-context-menu-content-available-height': 'var(--destyler-popper-available-height)',
        '--destyler-context-menu-trigger-width': 'var(--destyler-popper-anchor-width)',
        '--destyler-context-menu-trigger-height': 'var(--destyler-popper-anchor-height)',
      },
      onCloseAutoFocus: (event: any) => {
        if (!event.defaultPrevented && this.hasInteractedOutside)
          event.preventDefault()
        this.hasInteractedOutside = false
      },
      onInteractOutside: (event: any) => {
        if (!event.defaultPrevented && !this.rootContext.modal.value)
          this.hasInteractedOutside = true
      },
    }), () => this.$slots.default?.())
  },
})
