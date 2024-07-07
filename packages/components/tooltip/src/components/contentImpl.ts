import type { PropType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, ref, useSlots } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { useEventListener } from '@vueuse/core'
import { PopperContent, popperContentProps } from '@destyler/popper'
import { DismissableLayer } from '@destyler/dismissable-layer'
import { Visuallyhidden } from '@destyler/visually-hidden'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { TOOLTIP_OPEN } from '../utils'
import { injectTooltipRootContext } from './root'

export const tooltipContentImplProps = {
  ...primitiveProps,
  side: {
    ...popperContentProps.side,
    default: 'top',
  },
  sideOffset: {
    ...popperContentProps.sideOffset,
  },
  align: {
    ...popperContentProps.align,
  },
  alignOffset: {
    ...popperContentProps.alignOffset,
  },
  avoidCollisions: {
    ...popperContentProps.avoidCollisions,
  },
  collisionBoundary: {
    ...popperContentProps.collisionBoundary,
  },
  collisionPadding: {
    ...popperContentProps.collisionPadding,
  },
  arrowPadding: {
    ...popperContentProps.arrowPadding,
  },
  sticky: {
    ...popperContentProps.sticky,
  },
  hideWhenDetached: {
    ...popperContentProps.hideWhenDetached,
  },
  ariaLabel: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type TooltipContentImplProps = ExtractPublicPropTypes<typeof tooltipContentImplProps>

export const tooltipContentImplEmits = {
  escapeKeyDown: (_event: KeyboardEvent) => true,
  pointerDownOutside: (_event: Event) => true,
}

export const TooltipContentImpl = defineComponent({
  name: 'DestylerTooltipContentImpl',
  props: tooltipContentImplProps,
  emits: tooltipContentImplEmits,
  setup(props) {
    const contentElement = ref<HTMLElement>()
    const rootContext = injectTooltipRootContext()

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
      contentElement,
      rootContext,
      popperContentProps,
      ariaLabel,
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
      onDismiss: () => {
        this.rootContext.onClose()
      },
    }, () => h(PopperContent, mergeProps(this.$attrs, this.popperContentProps, {
      'ref': 'contentElement',
      'data-state': this.rootContext.stateAttribute.value,
      'style': {
        '--destyler_tooltip_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_tooltip_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_tooltip_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_tooltip_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_tooltip_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }), () => [
      this.$slots.default?.(),
      h(Visuallyhidden, {
        role: 'tooltip',
      }, () => this.ariaLabel),
    ]))
  },
})
