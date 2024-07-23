import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { refAutoReset, unrefElement } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { Visuallyhidden } from '@destyler/visually-hidden'

import { getOpenState, makeContentId, makeTriggerId } from '../utils'
import { injectNavigationContext } from './root'
import { injectNavigationItemContext } from './item'

export const navigationTriggerProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type NavigationTriggerProps = ExtractPublicPropTypes<typeof navigationTriggerProps>

export const NavigationTrigger = defineComponent({
  name: 'DestylerNavigationTrigger',
  inheritAttrs: false,
  props: navigationTriggerProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props) {
    const menuContext = injectNavigationContext()
    const itemContext = injectNavigationItemContext()

    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    const triggerId = ref('')
    const contentId = ref('')

    const hasPointerMoveOpenedRef = refAutoReset(false, 300)
    const wasClickCloseRef = ref(false)

    const open = computed(() => itemContext.value === menuContext.modelValue.value)

    onMounted(() => {
      itemContext.triggerRef = triggerElement
      triggerId.value = makeTriggerId(menuContext.baseId, itemContext.value)
      contentId.value = makeContentId(menuContext.baseId, itemContext.value)
    })

    function handlePointerEnter() {
      if (menuContext.disableHoverTrigger.value)
        return

      wasClickCloseRef.value = false
      itemContext.wasEscapeCloseRef.value = false
    }

    function handlePointerMove(ev: PointerEvent) {
      if (menuContext.disableHoverTrigger.value)
        return

      if (ev.pointerType === 'mouse') {
        if (
          props.disabled
          || wasClickCloseRef.value
          || itemContext.wasEscapeCloseRef.value
          || hasPointerMoveOpenedRef.value
        ) {
          return
        }

        menuContext.onTriggerEnter(itemContext.value)
        hasPointerMoveOpenedRef.value = true
      }
    }

    function handlePointerLeave(ev: PointerEvent) {
      if (menuContext.disableHoverTrigger.value)
        return

      if (ev.pointerType === 'mouse') {
        if (props.disabled)
          return
        menuContext.onTriggerLeave()
        hasPointerMoveOpenedRef.value = false
      }
    }

    function handleClick(event: PointerEvent) {
      if (event.pointerType === 'mouse' && menuContext.disableClickTrigger.value)
        return

      if (hasPointerMoveOpenedRef.value)
        return

      if (open.value)
        menuContext.onItemSelect('')
      else menuContext.onItemSelect(itemContext.value)

      wasClickCloseRef.value = open.value
    }

    function handleKeydown(ev: KeyboardEvent) {
      const verticalEntryKey = menuContext.dir.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
      const entryKey = { horizontal: 'ArrowDown', vertical: verticalEntryKey }[
        menuContext.orientation
      ]
      if (open.value && ev.key === entryKey) {
        itemContext.onEntryKeyDown()
        ev.preventDefault()
        ev.stopPropagation()
      }
    }

    function setFocusProxyRef(node: VNode) {
      // @ts-expect-error unrefElement expect MaybeRef, but also support Vnode
      itemContext.focusProxyRef.value = unrefElement(node)
      return undefined
    }

    function handleVisuallyHiddenFocus(ev: FocusEvent) {
      const content = document.getElementById(itemContext.contentId)
      const prevFocusedElement = ev.relatedTarget as HTMLElement | null

      const wasTriggerFocused = prevFocusedElement === triggerElement.value
      const wasFocusFromContent = content?.contains(prevFocusedElement)

      if (wasTriggerFocused || !wasFocusFromContent)
        itemContext.onFocusProxyEnter(wasTriggerFocused ? 'start' : 'end')
    }

    return {
      forwardRef,
      open,
      triggerId,
      contentId,
      menuContext,
      handlePointerEnter,
      handlePointerMove,
      handlePointerLeave,
      handleClick,
      handleKeydown,
      setFocusProxyRef,
      handleVisuallyHiddenFocus,
    }
  },
  render() {
    return [
      h(Primitive, mergeProps(this.$attrs, {
        'id': this.triggerId,
        'ref': (el: any) => this.forwardRef(el),
        'disabled': this.$props.disabled,
        'data-disabled': this.$props.disabled ? '' : undefined,
        'data-state': getOpenState(this.open),
        'aria-expanded': this.open,
        'aria-controls': this.contentId,
        'asChild': this.$props.asChild,
        'as': this.$props.as,
        'data-destyler-collection-item': '',
        'onPointerenter': () => {
          this.handlePointerEnter()
        },
        'onPointermove': (ev: PointerEvent) => {
          this.handlePointerMove(ev)
        },
        'onPointerleave': (ev: PointerEvent) => {
          this.handlePointerLeave(ev)
        },
        'onClick': (event: PointerEvent) => {
          this.handleClick(event)
        },
        'onKeydown': (ev: KeyboardEvent) => {
          this.handleKeydown(ev)
        },
      }), () => this.$slots.default?.()),
      this.open
        ? h(Visuallyhidden, {
          'ref': (el: any) => this.setFocusProxyRef(el),
          'aria-hidden': '',
          'tabindex': 0,
          'onFocus': (ev: FocusEvent) => {
            this.handleVisuallyHiddenFocus(ev)
          },
        }, () => {
          return this.menuContext.viewport
            ? h('span', {
              'aria-owns': this.contentId,
            })
            : null
        })
        : null,
    ]
  },
})
