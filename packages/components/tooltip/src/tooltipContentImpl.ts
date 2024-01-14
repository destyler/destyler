import type { PropType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, ref, useSlots } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { Align, Side } from '@destyler/popper'
import { useEventListener } from '@vueuse/core'
import { DestylerPopperContent } from '@destyler/popper'
import { DestylerDismissableLayer } from '@destyler/dismissable-layer'
import { DestylerVisuallyhidden } from '@destyler/visually-hidden'

import { injectTooltipRootContext } from './tooltipRoot'
import { TOOLTIP_OPEN } from './utils'

export const destylerTooltipContentImplProps = {
  ...destylerPrimitiveProps,
  side: {
    type: String as PropType<Side>,
    required: false,
    default: 'top',
  },
  sideOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  align: {
    type: String as PropType<Align>,
    required: false,
    default: 'center',
  },
  alignOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  avoidCollisions: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  collisionBoundary: {
    type: [Object, Array, null] as PropType<Element | null | Array<Element | null>>,
    required: false,
    default: () => [],
  },
  collisionPadding: {
    type: [Number, Object] as PropType<number | Partial<Record<Side, number>>>,
    required: false,
    default: 0,
  },
  arrowPadding: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  sticky: {
    type: String as PropType<'partial' | 'always'>,
    required: false,
    default: 'partial',
  },
  hideWhenDetached: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  ariaLabel: {
    type: String as PropType<string>,
    required: false,
  },
}

export const destylerTooltipContentImplEmits = ['escapeKeyDown', 'pointerDownOutside']
export const DestylerTooltipContentImpl = defineComponent({
  name: 'DestylerTooltipContentImpl',
  props: destylerTooltipContentImplProps,
  emits: destylerTooltipContentImplEmits,
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
    return h(DestylerDismissableLayer, {
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
    }, h(DestylerPopperContent, {
      'ref': 'contentElement',
      'data-state': this.rootContext.stateAttribute.value,
      ...mergeProps(this.$attrs, this.popperContentProps),
      'style': {
        '--destyler_tooltip_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_tooltip_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_tooltip_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_tooltip_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_tooltip_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
    }, [
      this.$slots.default?.(),
      h(DestylerVisuallyhidden, {
        role: 'tooltip',
      }, this.ariaLabel),
    ]))
  },
})
