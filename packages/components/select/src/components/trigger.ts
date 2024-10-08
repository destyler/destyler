import type { PropType } from 'vue'
import { computed, defineComponent, h, onMounted, withModifiers } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useCollection, useForwardExpose, useId, useTypeahead } from '@destyler/composition'
import { PopperAnchor } from '@destyler/popper'

import { OPEN_KEYS, shouldShowPlaceholder } from '../utils'
import { injectSelectRootContext } from './root'

export const selectTriggerProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  /**
   * When `true`, prevents the user from interacting with the accordion and all its items
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type SelectTriggerProps = ExtractPublicPropTypes<typeof selectTriggerProps>

export const SelectTrigger = defineComponent({
  name: 'DestylerSelectTrigger',
  props: selectTriggerProps,
  setup(props) {
    const rootContext = injectSelectRootContext()

    const isDisabled = computed(() => rootContext.disabled?.value || props.disabled)

    const { forwardRef, currentElement: triggerElement } = useForwardExpose()

    rootContext.contentId ||= useId(undefined, 'destyler-select-content')
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

    function handlePointerOpen(event: PointerEvent) {
      handleOpen()
      rootContext.triggerPointerDownPosRef.value = {
        x: Math.round(event.pageX),
        y: Math.round(event.pageY),
      }
    }

    return {
      search,
      isDisabled,
      rootContext,
      forwardRef,
      handleOpen,
      handleTypeaheadSearch,
      handlePointerOpen,
    }
  },
  render() {
    return h(PopperAnchor, {
      asChild: true,
    }, () => h(Primitive, {
      'ref': this.forwardRef,
      'role': 'combobox',
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-controls': this.rootContext.contentId,
      'aria-expanded': this.rootContext.open.value || false,
      'aria-required': this.rootContext.required?.value,
      'aria-autocomplete': 'none',
      'disabled': this.isDisabled,
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
        if (event.pointerType === 'touch')
          return event.preventDefault()

        const target = event.target as HTMLElement
        if (target.hasPointerCapture(event.pointerId)) {
          target.releasePointerCapture(event.pointerId)
        }

        if (event.button === 0 && event.ctrlKey === false) {
          this.handlePointerOpen(event)
          event.preventDefault()
        }
      },
      'onPointerup': withModifiers((event: any) => {
        if (event.pointerType === 'touch')
          this.handlePointerOpen(event)
      }, ['prevent']),
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
    }, () => this.$slots.default?.()))
  },
})
