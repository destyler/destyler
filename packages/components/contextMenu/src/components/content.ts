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
  /**
   * An offset in pixels from the `start` or `end` alignment options.
   *
   * @default 0
   */
  alignOffset: {
    ...menuContentProps.alignOffset,
    default: 0,
  },
  /**
   * When `true`, overrides the side andalign preferences
   * to prevent collisions with boundary edges.
   * @default true
   */
  avoidCollisions: {
    ...menuContentProps.avoidCollisions,
    default: true,
  },
  /**
   * The element used as the collision boundary. By default
   * this is the viewport, though you can provide additional
   * element(s) to be included in this check.
   *
   * @default () => []
   */
  collisionBoundary: {
    ...menuContentProps.collisionBoundary,
    default: () => [],
  },
  /**
   * The distance in pixels from the boundary edges where collision
   * detection should occur. Accepts a number (same for all sides),
   * or a partial padding object, for example: { top: 20, left: 20 }.
   *
   * @default 0
   */
  collisionPadding: {
    ...menuContentProps.collisionPadding,
    default: 0,
  },
  /**
   * The sticky behavior on the align axis. `partial` will keep the
   * content in the boundary as long as the trigger is at least partially
   * in the boundary whilst "always" will keep the content in the boundary regardless.
   * @default partial
   */
  sticky: {
    ...menuContentProps.sticky,
    default: 'partial',
  },
  /**
   * Whether to hide the content when the trigger becomes fully occluded.
   *
   * @default false
   */
  hideWhenDetached: {
    ...menuContentProps.hideWhenDetached,
    default: false,
  },
  /**
   * Force content to be position within the viewport.
   *
   * Might overlap the reference element, which may not be desired.
   *
   * @default false
   */
  prioritizePosition: {
    ...menuContentProps.prioritizePosition,
    default: false,
  },
  /**
   * When `true`, keyboard navigation will loop from last item to first, and vice versa.
   */
  loop: {
    ...menuContentProps.loop,
  },
  /**
   * Used to force mounting when more control is needed.
   * Useful when controlling animation with Vue animation libraries.
   */
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
