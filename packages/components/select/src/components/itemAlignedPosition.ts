import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, mergeProps, nextTick, onMounted, ref } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { clamp, createContext } from '@destyler/shared'
import { useCollection, useForwardExpose } from '@destyler/composition'

import { CONTENT_MARGIN } from '../utils'
import { injectSelectRootContext } from './root'
import { injectSelectContentContext } from './contentImpl'

export const destylerSelectItemAlignedPositionProps = {
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
} as const

export type DestylerSelectItemAlignedPositionProps = ExtractPublicPropTypes<typeof destylerSelectItemAlignedPositionProps>

export interface SelectItemAlignedPositionContext {
  contentWrapper?: Ref<HTMLElement | undefined>
  shouldExpandOnScrollRef?: Ref<boolean>
  onScrollButtonChange: (node: HTMLElement | undefined) => void
}

export const [injectSelectItemAlignedPositionContext, provideSelectItemAlignedPositionContext]
  = createContext<SelectItemAlignedPositionContext>('DestylerSelectItemAlignedPosition')

export const DestylerSelectItemAlignedPosition = defineComponent({
  name: 'DestylerSelectItemAlignedPosition',
  inheritAttrs: false,
  props: destylerSelectItemAlignedPositionProps,
  emits: ['placed'],
  setup(_, { emit }) {
    const { injectCollection } = useCollection()
    const rootContext = injectSelectRootContext()
    const contentContext = injectSelectContentContext()
    const collectionItems = injectCollection()

    const shouldExpandOnScrollRef = ref(false)
    const shouldRepositionRef = ref(true)

    const contentWrapperElement = ref<HTMLElement>()
    const { forwardRef, currentElement: contentElement } = useForwardExpose()

    const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext!

    function position() {
      if (
        rootContext.triggerElement.value
        && rootContext.valueElement.value
        && contentWrapperElement.value
        && contentElement.value
        && viewport?.value
        && selectedItem?.value
        && selectedItemText?.value
      ) {
        const triggerRect = rootContext.triggerElement.value.getBoundingClientRect()

        const contentRect = contentElement.value.getBoundingClientRect()
        const valueNodeRect = rootContext.valueElement.value.getBoundingClientRect()
        const itemTextRect = selectedItemText.value.getBoundingClientRect()

        if (rootContext.dir.value !== 'rtl') {
          const itemTextOffset = itemTextRect.left - contentRect.left
          const left = valueNodeRect.left - itemTextOffset
          const leftDelta = triggerRect.left - left
          const minContentWidth = triggerRect.width + leftDelta
          const contentWidth = Math.max(minContentWidth, contentRect.width)
          const rightEdge = window.innerWidth - CONTENT_MARGIN
          const clampedLeft = clamp(left, CONTENT_MARGIN, rightEdge - contentWidth)

          contentWrapperElement.value.style.minWidth = `${minContentWidth}px`
          contentWrapperElement.value.style.left = `${clampedLeft}px`
        }
        else {
          const itemTextOffset = contentRect.right - itemTextRect.right
          const right = window.innerWidth - valueNodeRect.right - itemTextOffset
          const rightDelta = window.innerWidth - triggerRect.right - right
          const minContentWidth = triggerRect.width + rightDelta
          const contentWidth = Math.max(minContentWidth, contentRect.width)
          const leftEdge = window.innerWidth - CONTENT_MARGIN
          const clampedRight = clamp(
            right,
            CONTENT_MARGIN,
            leftEdge - contentWidth,
          )

          contentWrapperElement.value.style.minWidth = `${minContentWidth}px`
          contentWrapperElement.value.style.right = `${clampedRight}px`
        }

        const items = collectionItems.value
        const availableHeight = window.innerHeight - CONTENT_MARGIN * 2
        const itemsHeight = viewport.value.scrollHeight

        const contentStyles = window.getComputedStyle(contentElement.value)
        const contentBorderTopWidth = Number.parseInt(
          contentStyles.borderTopWidth,
          10,
        )
        const contentPaddingTop = Number.parseInt(contentStyles.paddingTop, 10)
        const contentBorderBottomWidth = Number.parseInt(
          contentStyles.borderBottomWidth,
          10,
        )
        const contentPaddingBottom = Number.parseInt(
          contentStyles.paddingBottom,
          10,
        )

        const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth
        const minContentHeight = Math.min(
          selectedItem.value.offsetHeight * 5,
          fullContentHeight,
        )

        const viewportStyles = window.getComputedStyle(viewport.value)
        const viewportPaddingTop = Number.parseInt(viewportStyles.paddingTop, 10)
        const viewportPaddingBottom = Number.parseInt(
          viewportStyles.paddingBottom,
          10,
        )

        const topEdgeToTriggerMiddle
      = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN
        const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle

        const selectedItemHalfHeight = selectedItem.value.offsetHeight / 2
        const itemOffsetMiddle
      = selectedItem.value.offsetTop + selectedItemHalfHeight
        const contentTopToItemMiddle
      = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle
        const itemMiddleToContentBottom
      = fullContentHeight - contentTopToItemMiddle

        const willAlignWithoutTopOverflow
      = contentTopToItemMiddle <= topEdgeToTriggerMiddle

        if (willAlignWithoutTopOverflow) {
          const isLastItem = selectedItem.value === items[items.length - 1]
          contentWrapperElement.value.style.bottom = `${0}px`
          const viewportOffsetBottom
        = contentElement.value.clientHeight
        - viewport.value.offsetTop
        - viewport.value.offsetHeight
          const clampedTriggerMiddleToBottomEdge = Math.max(
            triggerMiddleToBottomEdge,
            selectedItemHalfHeight
            + (isLastItem ? viewportPaddingBottom : 0)
            + viewportOffsetBottom
            + contentBorderBottomWidth,
          )
          const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge
          contentWrapperElement.value.style.height = `${height}px`
        }
        else {
          const isFirstItem = selectedItem.value === items[0]
          contentWrapperElement.value.style.top = `${0}px`
          const clampedTopEdgeToTriggerMiddle = Math.max(
            topEdgeToTriggerMiddle,
            contentBorderTopWidth
            + viewport.value.offsetTop
            + (isFirstItem ? viewportPaddingTop : 0)
            + selectedItemHalfHeight,
          )
          const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom
          contentWrapperElement.value.style.height = `${height}px`
          viewport.value.scrollTop
        = contentTopToItemMiddle
        - topEdgeToTriggerMiddle
        + viewport.value.offsetTop
        }

        contentWrapperElement.value.style.margin = `${CONTENT_MARGIN}px 0`
        contentWrapperElement.value.style.minHeight = `${minContentHeight}px`
        contentWrapperElement.value.style.maxHeight = `${availableHeight}px`

        emit('placed')

        requestAnimationFrame(() => (shouldExpandOnScrollRef.value = true))
      }
    }

    const contentZIndex = ref('')

    onMounted(async () => {
      await nextTick()
      position()
      if (contentElement.value)
        contentZIndex.value = window.getComputedStyle(contentElement.value).zIndex
    })

    function handleScrollButtonChange(node: HTMLElement | undefined) {
      if (node && shouldRepositionRef.value === true) {
        position()
        focusSelectedItem?.()
        shouldRepositionRef.value = false
      }
    }

    provideSelectItemAlignedPositionContext({
      contentWrapper: contentWrapperElement,
      shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange,
    })

    return {
      contentWrapperElement,
      contentZIndex,
      forwardRef,
    }
  },
  render() {
    return h('dvi', {
      ref: 'contentWrapperElement',
      style: {
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        zIndex: this.contentZIndex,
      },
    }, h(DestylerPrimitive, mergeProps(this.$attrs, this.$props, {
      ref: (el: any) => this.forwardRef(el),
      style: {
        boxSizing: 'border-box',
        maxHeight: '100%',
      },
    }), {
      default: () => this.$slots.default?.(),
    }))
  },
})
