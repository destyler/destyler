import { computed, defineComponent, h, mergeProps, ref, watchEffect } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useArrowNavigation, useCollection, useForwardExpose } from '@destyler/composition'
import { DismissableLayer, dismissableLayerProps } from '@destyler/dismissable-layer'
import { dismissableLayerEmits } from '@destyler/dismissable-layer/component'

import { EVENT_ROOT_CONTENT_DISMISS, focusFirst, getOpenState, getTabbableCandidates, makeContentId, makeTriggerId } from '../utils'
import { injectNavigationContext } from './root'
import { injectNavigationItemContext } from './item'

type MotionAttribute = 'to-start' | 'to-end' | 'from-start' | 'from-end'

export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>

export const navigationContentImplProps = {
  ...dismissableLayerProps,
} as const

export type NavigationContentImplProps = ExtractPublicPropTypes<typeof navigationContentImplProps>

export const navigationContentImplEmits = {
  ...dismissableLayerEmits,
}

export const NavigationContentImpl = defineComponent({
  name: 'DestylerNavigationContentImpl',
  props: navigationContentImplProps,
  emit: navigationContentImplEmits,
  setup(_, { emit }) {
    const { injectCollection } = useCollection('nav')
    const collectionItems = injectCollection()
    const { forwardRef, currentElement } = useForwardExpose()

    const navigationContext = injectNavigationContext()
    const itemContext = injectNavigationItemContext()

    const triggerId = makeTriggerId(navigationContext.baseId, itemContext.value)
    const contentId = makeContentId(navigationContext.baseId, itemContext.value)

    const prevMotionAttributeRef = ref<MotionAttribute | null>(null)
    const motionAttribute = computed(() => {
      const items = collectionItems.value
      const values = items.map(item => item.id.split('trigger-')[1])
      if (navigationContext.dir.value === 'rtl')
        values.reverse()
      const index = values.indexOf(navigationContext.modelValue.value)
      const prevIndex = values.indexOf(navigationContext.previousValue.value)
      const isSelected = itemContext.value === navigationContext.modelValue.value
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
        if (navigationContext.rootNavigationMenu?.value?.contains(target))
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
    = navigationContext.isRootMenu && navigationContext.viewport.value?.contains(target)

        if (isTrigger || isRootViewport || !navigationContext.isRootMenu)
          ev.preventDefault()
      }
    }

    watchEffect((cleanupFn) => {
      const content = currentElement.value
      if (navigationContext.isRootMenu && content) {
        const handleClose = () => {
          navigationContext.onItemDismiss()
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
        navigationContext.onItemDismiss()
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
      navigationContext,
      itemContext,
      handleKeydown,
      handleEscapeKeyDown,
      handlePointerDownOutside,
      handleFocusOutside,
      handleDismiss,
    }
  },
  render() {
    return h(DismissableLayer, mergeProps(this.$props, {
      'ref': (el: any) => this.forwardRef(el),
      'id': this.contentId,
      'aria-labelledby': this.triggerId,
      'data-motion': this.motionAttribute,
      'data-state': getOpenState(this.navigationContext.modelValue.value === this.itemContext.value),
      'data-orientation': this.navigationContext.orientation,
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
    }), () => this.$slots.default?.())
  },
})
