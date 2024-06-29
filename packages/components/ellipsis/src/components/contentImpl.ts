import type { PropType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, ref, useSlots } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { useEventListener } from '@vueuse/core'
import { PopperContent } from '@destyler/popper'
import { DismissableLayer } from '@destyler/dismissable-layer'
import { Visuallyhidden } from '@destyler/visually-hidden'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { ELLIPSIS_OPEN } from '../utils'
import { injectEllipsisRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

type Side = (typeof SIDE_OPTIONS)[number]
type Align = (typeof ALIGN_OPTIONS)[number]

export const ellipsisContentImplProps = {
  ...primitiveProps,
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
} as const

export type EllipsisContentImplProps = ExtractPublicPropTypes<typeof ellipsisContentImplProps>

export const ellipsisContentImplEmits = ['escapeKeyDown', 'pointerDownOutside']

export const EllipsisContentImpl = defineComponent({
  name: 'DestylerEllipsisContentImpl',
  props: ellipsisContentImplProps,
  emits: ellipsisContentImplEmits,
  setup(props) {
    const contentElement = ref<HTMLElement>()
    const rootContext = injectEllipsisRootContext()

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
      useEventListener(window, ELLIPSIS_OPEN, rootContext.onClose)
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
      onEscapeKeyDown: (event: any) => {
        this.$emit('escapeKeyDown', event)
      },
      onPointerDownOutside: (event: any) => {
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
