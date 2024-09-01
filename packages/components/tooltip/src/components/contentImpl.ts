import type { PropType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, useSlots, withModifiers } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { useEventListener } from '@vueuse/core'
import { PopperContent, popperContentProps } from '@destyler/popper'
import { DismissableLayer } from '@destyler/dismissable-layer'
import { VisuallyHidden } from '@destyler/visually-hidden'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { TOOLTIP_OPEN } from '../utils'
import { injectTooltipRootContext } from './root'

export const tooltipContentImplProps = {
  ...primitiveProps,
  /**
   * The preferred side of the trigger to render against when open.
   * Will be reversed when collisions occur and avoidCollisions
   * is enabled.
   *
   * @defaultValue top
   */
  side: {
    ...popperContentProps.side,
    default: 'top',
  },
  /**
   * The distance in pixels from the trigger.
   *
   * @default 0
   */
  sideOffset: {
    ...popperContentProps.sideOffset,
  },
  /**
   * The preferred alignment against the trigger.
   * May change when collisions occur.
   *
   * @default center
   */
  align: {
    ...popperContentProps.align,
  },
  /**
   * An offset in pixels from the `start` or `end` alignment options.
   *
   * @defaultValue 0
   */
  alignOffset: {
    ...popperContentProps.alignOffset,
  },
  /**
   * When `true`, overrides the side andalign preferences
   * to prevent collisions with boundary edges.
   *
   * @defaultValue true
   */
  avoidCollisions: {
    ...popperContentProps.avoidCollisions,
  },
  /**
   * The element used as the collision boundary. By default
   * this is the viewport, though you can provide additional
   * element(s) to be included in this check.
   *
   * @defaultValue () => []
   */
  collisionBoundary: {
    ...popperContentProps.collisionBoundary,
  },
  /**
   * The distance in pixels from the boundary edges where collision
   * detection should occur. Accepts a number (same for all sides),
   * or a partial padding object, for example: { top: 20, left: 20 }.
   *
   * @defaultValue 0
   */
  collisionPadding: {
    ...popperContentProps.collisionPadding,
  },
  /**
   * The distance in pixels from the boundary edges where collision
   * detection should occur. Accepts a number (same for all sides),
   * or a partial padding object, for example: { top: 20, left: 20 }.
   *
   * @defaultValue 0
   */
  arrowPadding: {
    ...popperContentProps.arrowPadding,
  },
  /**
   * The sticky behavior on the align axis. `partial` will keep the
   * content in the boundary as long as the trigger is at least partially
   * in the boundary whilst "always" will keep the content in the boundary
   * regardless.
   *
   * @defaultValue partial
   */
  sticky: {
    ...popperContentProps.sticky,
  },
  /**
   * Whether to hide the content when the trigger becomes fully occluded.
   *
   * @defaultValue false
   */
  hideWhenDetached: {
    ...popperContentProps.hideWhenDetached,
  },
  /**
   * By default, screenreaders will announce the content inside
   * the component. If this is not descriptive enough, or you have
   * content that cannot be announced, use aria-label as a more
   * descriptive label.
   *
   */
  ariaLabel: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type TooltipContentImplProps = ExtractPublicPropTypes<typeof tooltipContentImplProps>

export const tooltipContentImplEmits = {
  /**
   * Event handler called when focus moves to the destructive action after opening. It can be prevented by calling `event.preventDefault`
   */
  escapeKeyDown: (_event: KeyboardEvent) => true,
  /**
   * Event handler called when a pointer event occurs outside the bounds of the component. It can be prevented by calling `event.preventDefault`.
   */
  pointerDownOutside: (_event: Event) => true,
}

export const TooltipContentImpl = defineComponent({
  name: 'DestylerTooltipContentImpl',
  props: tooltipContentImplProps,
  emits: tooltipContentImplEmits,
  setup(props) {
    const rootContext = injectTooltipRootContext()

    const { forwardRef } = useForwardExpose()
    const slot = useSlots()
    const defaultSlot = computed(() => slot.default?.())
    const ariaLabel = computed(() => {
      if (props.ariaLabel)
        return props.ariaLabel
      let content = ''

      function recursiveTextSearch(node: VNode) {
        if (typeof node.children === 'string')
          content += node.children
        else if (Array.isArray(node.children))
          node.children.forEach(child => recursiveTextSearch(child as VNode))
      }

      defaultSlot.value?.forEach(node => recursiveTextSearch(node))
      return content
    })

    const popperContentProps = computed(() => {
      const { ariaLabel: _, ...restProps } = props
      return restProps
    })

    onMounted(() => {
      // Close the tooltip if the trigger is scrolled
      useEventListener(window, 'scroll', (event) => {
        const target = event.target as HTMLElement
        if (target?.contains(rootContext.trigger.value!))
          rootContext.onClose()
      })
      // Close this tooltip if another one opens
      useEventListener(window, TOOLTIP_OPEN, rootContext.onClose)
    })

    return {
      rootContext,
      popperContentProps,
      ariaLabel,
      forwardRef,
    }
  },
  render() {
    return h(DismissableLayer, {
      asChild: true,
      disableOutsidePointerEvents: false,
      onEscapeKeyDown: (event) => {
        this.$emit('escapeKeyDown', event)
      },
      onPointerDownOutside: (event) => {
        if (this.rootContext.disableClosingTrigger.value && this.rootContext.trigger.value?.contains(event.target as HTMLElement))
          event.preventDefault()

        this.$emit('pointerDownOutside', event)
      },
      onFocusOutside: withModifiers(() => {}, ['prevent']),
      onDismiss: () => {
        this.rootContext.onClose()
      },
    }, () => h(PopperContent, mergeProps(
      {
        ...this.$attrs,
        ...this.popperContentProps,
      },
      {
        'ref': this.forwardRef,
        'data-state': this.rootContext.stateAttribute.value,
        'style': {
          '--destyler-tooltip-content-transform-origin': 'var(--destyler-popper-transform-origin)',
          '--destyler-tooltip-content-available-width': 'var(--destyler-popper-available-width)',
          '--destyler-tooltip-content-available-height': 'var(--destyler-popper-available-height)',
          '--destyler-tooltip-trigger-width': 'var(--destyler-popper-anchor-width)',
          '--destyler-tooltip-trigger-height': 'var(--destyler-popper-anchor-height)',
        },
      },
    ), () => [
      this.$slots.default?.(),
      h(VisuallyHidden, {
        role: 'tooltip',
        id: this.rootContext.contentId,
      }, () => this.ariaLabel),
    ]))
  },
})
