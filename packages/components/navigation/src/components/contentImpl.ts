import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, watchEffect, withDirectives } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useArrowNavigation, useCollection, useForwardExpose } from '@destyler/composition'
import { DestylerDismissableLayer } from '@destyler/dismissable-layer'
import { BindOnceDirective } from '@destyler/directives'

import { EVENT_ROOT_CONTENT_DISMISS, focusFirst, getOpenState, getTabbableCandidates, makeContentId, makeTriggerId } from '../utils'
import { injectNavigationContext } from './root'
import { injectNavigationItemContext } from './item'

type MotionAttribute = 'to-start' | 'to-end' | 'from-start' | 'from-end'

export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>

export const destylerNavigationContentImplProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disableOutsidePointerEvents: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  isDismissable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerNavigationContentImplProps = ExtractPublicPropTypes<typeof destylerNavigationContentImplProps>

export const DestylerNavigationContentImpl = defineComponent({
  name: 'DestylerNavigationContentImpl',
  props: destylerNavigationContentImplProps,
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(props, { emit }) {
    const { injectCollection } = useCollection('nav')
    const collectionItems = injectCollection()
    const { forwardRef, currentElement } = useForwardExpose()

    const menuContext = injectNavigationContext()
    const itemContext = injectNavigationItemContext()

    const triggerId = makeTriggerId(menuContext.baseId, itemContext.value)
    const contentId = makeContentId(menuContext.baseId, itemContext.value)

    const prevMotionAttributeRef = ref<MotionAttribute | null>(null)
    const motionAttribute = computed(() => {
      const items = collectionItems.value
      const values = items.map(item => item.id.split('trigger-')[1])
      if (menuContext.dir.value === 'rtl')
        values.reverse()
      const index = values.indexOf(menuContext.modelValue.value)
      const prevIndex = values.indexOf(menuContext.previousValue.value)
      const isSelected = itemContext.value === menuContext.modelValue.value
      const wasSelected = prevIndex === values.indexOf(itemContext.value)

      if (!isSelected && !wasSelected)
        return prevMotionAttributeRef.value

      const attribute = (() => {
        if (index !== prevIndex) {
          if (isSelected && prevIndex !== -1)
            return index > prevIndex ? 'from-end' : 'from-start'
          if (wasSelected && index !== -1)
            return index > prevIndex ? 'to-start' : 'to-end'
        }
        return null
      })()

      prevMotionAttributeRef.value = attribute
      return attribute
    })

    function handleFocusOutside(ev: FocusOutsideEvent) {
      emit('focusOutside', ev)
      emit('interactOutside', ev)

      if (!ev.defaultPrevented) {
        itemContext.onContentFocusOutside()

        const target = ev.target as HTMLElement
        if (menuContext.rootNavigationMenu?.value?.contains(target))
          ev.preventDefault()
      }
    }

    function handlePointerDownOutside(ev: PointerDownOutsideEvent) {
      emit('pointerDownOutside', ev)

      if (!ev.defaultPrevented) {
        const target = ev.target as HTMLElement
        const isTrigger = collectionItems.value.some(item =>
          item.contains(target),
        )
        const isRootViewport
          = menuContext.isRootMenu && menuContext.viewport.value?.contains(target)

        if (isTrigger || isRootViewport || !menuContext.isRootMenu)
          ev.preventDefault()
      }
    }

    watchEffect((cleanupFn) => {
      const content = currentElement.value
      if (menuContext.isRootMenu && content) {
        const handleClose = () => {
          itemContext.onRootContentClose()
          if (content.contains(document.activeElement))
            itemContext.triggerRef.value?.focus()
        }
        content.addEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose)

        cleanupFn(() =>
          content.removeEventListener(EVENT_ROOT_CONTENT_DISMISS, handleClose),
        )
      }
    })

    function handleEscapeKeyDown(ev: KeyboardEvent) {
      emit('escapeKeyDown', ev)

      if (!ev.defaultPrevented) {
        menuContext.onItemDismiss()
        itemContext.triggerRef?.value?.focus()
        itemContext.wasEscapeCloseRef.value = true
      }
    }

    function handleKeydown(ev: KeyboardEvent) {
      const isMetaKey = ev.altKey || ev.ctrlKey || ev.metaKey
      const isTabKey = ev.key === 'Tab' && !isMetaKey
      const candidates = getTabbableCandidates(ev.currentTarget as HTMLElement)

      if (isTabKey) {
        const focusedElement = document.activeElement
        const index = candidates.findIndex(
          candidate => candidate === focusedElement,
        )
        const isMovingBackwards = ev.shiftKey
        const nextCandidates = isMovingBackwards
          ? candidates.slice(0, index).reverse()
          : candidates.slice(index + 1, candidates.length)

        if (focusFirst(nextCandidates)) {
          ev.preventDefault()
        }
        else {
          itemContext.focusProxyRef.value?.focus()
          return
        }
      }

      const newSelectedElement = useArrowNavigation(
        ev,
        document.activeElement as HTMLElement,
        undefined,
        { itemsArray: candidates, loop: false, enableIgnoredElement: true },
      )
      newSelectedElement?.focus()
    }

    function handleDismiss() {
      const rootContentDismissEvent = new Event(EVENT_ROOT_CONTENT_DISMISS, {
        bubbles: true,
        cancelable: true,
      })
      currentElement.value?.dispatchEvent(rootContentDismissEvent)
    }

    return {
      contentId,
      triggerId,
      forwardRef,
      motionAttribute,
      menuContext,
      itemContext,
      handleKeydown,
      handleEscapeKeyDown,
      handlePointerDownOutside,
      handleFocusOutside,
      handleDismiss,
    }
  },
  render() {
    return withDirectives(h(DestylerDismissableLayer, mergeProps(this.$props, {
      'ref': (el: any) => this.forwardRef(el),
      'aria-labelledby': this.triggerId,
      'data-motion': this.motionAttribute,
      'data-state': getOpenState(this.menuContext.modelValue.value === this.itemContext.value),
      'data-orientation': this.menuContext.orientation,
      'onKeydown': (event: any) => {
        this.handleKeydown(event)
      },
      'onEscapeKeyDown': (event: any) => {
        this.handleEscapeKeyDown(event)
      },
      'onPointerDownOutside': (event: any) => {
        this.handlePointerDownOutside(event)
      },
      'onFocusOutside': (event: any) => {
        this.handleFocusOutside(event)
      },
      'onDismiss': () => {
        this.handleDismiss()
      },
    }), () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.contentId }],
    ])
  },
})
