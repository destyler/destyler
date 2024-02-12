import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, onMounted } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useCollection, useForwardExpose, useTypeahead } from '@destyler/composition'
import { DestylerPopperAnchor } from '@destyler/popper'

import { OPEN_KEYS, shouldShowPlaceholder } from '../utils'
import { injectSelectRootContext } from './root'

export const destylerSelectTriggerProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerSelectTriggerProps = ExtractPublicPropTypes<typeof destylerSelectTriggerProps>

export const DestylerSelectTrigger = defineComponent({
  name: 'DestylerSelectTrigger',
  props: destylerSelectTriggerProps,
  setup(props) {
    const rootContext = injectSelectRootContext()
    const isDisabled = computed(() => rootContext.disabled?.value || props.disabled)

    const { forwardRef, currentElement: triggerElement } = useForwardExpose()

    onMounted(() => {
      rootContext.triggerElement = triggerElement
    })

    const { injectCollection } = useCollection()
    const collectionItems = injectCollection()

    const { search, handleTypeaheadSearch, resetTypeahead } = useTypeahead(collectionItems)
    function handleOpen() {
      if (!isDisabled.value) {
        rootContext.onOpenChange(true)
        // reset typeahead when we open
        resetTypeahead()
      }
    }

    return {
      search,
      isDisabled,
      rootContext,
      forwardRef,
      handleOpen,
      handleTypeaheadSearch,
    }
  },
  render() {
    return h(DestylerPopperAnchor, {
      asChild: true,
    }, h(DestylerPrimitive, {
      'ref': this.forwardRef,
      'role': 'combobox',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-controls': this.rootContext.contentId,
      'aria-expanded': this.rootContext.open.value || false,
      'aria-required': this.rootContext.required?.value,
      'aria-autocomplete': 'none',
      'disabled': this.$props.disabled,
      'dir': this.rootContext?.dir.value,
      'data-state': this.rootContext?.open.value ? 'open' : 'closed',
      'data-disabled': this.isDisabled ? '' : undefined,
      'data-placeholder': shouldShowPlaceholder(this.rootContext.modelValue?.value) ? '' : undefined,
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'onClick': (event: any) => {
        (event?.currentTarget as HTMLElement)?.focus()
      },
      'onPointerdown': (event: any) => {
        const target = event.target as HTMLElement
        if (target.hasPointerCapture(event.pointerId))
          target.releasePointerCapture(event.pointerId)

        if (event.button === 0 && event.ctrlKey === false) {
          this.handleOpen()
          this.rootContext.triggerPointerDownPosRef.value = {
            x: Math.round(event.pageX),
            y: Math.round(event.pageY),
          }
          event.preventDefault()
        }
      },
      'onKeydown': (event: any) => {
        const isTypingAhead = this.search !== ''
        const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
        if (!isModifierKey && event.key.length === 1) {
          if (isTypingAhead && event.key === ' ')
            return
        }
        this.handleTypeaheadSearch(event.key)
        if (OPEN_KEYS.includes(event.key)) {
          this.handleOpen()
          event.preventDefault()
        }
      },
    }, {
      default: () => this.$slots.default?.(),
    }))
  },
})
