import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, watch, watchEffect, withDirectives } from 'vue'
import { createContext, focusFirst, unrefElement } from '@destyler/shared'
import { useCollection, useFocusGuards, useForwardProps, useHideOthers, useTypeahead } from '@destyler/composition'
import { FocusScope } from '@destyler/focus-scope'
import { DismissableLayer } from '@destyler/dismissable-layer'
import { BindOnceDirective } from '@destyler/directives'

import { popperContentProps } from '@destyler/popper'
import { injectSelectRootContext } from './root'
import { SelectPopperPosition } from './popperPosition'
import { SelectItemAlignedPosition } from './itemAlignedPosition'

export const selectContentImplProps = {
  ...popperContentProps,
  position: {
    type: String as PropType<'item-aligned' | 'popper'>,
    required: false,
    default: 'item-aligned',
  },
} as const

export interface SelectContentContext {
  content?: Ref<HTMLElement | undefined>
  viewport?: Ref<HTMLElement | undefined>
  onViewportChange: (node: HTMLElement | undefined) => void
  itemRefCallback: (
    node: HTMLElement | undefined,
    value: string,
    disabled: boolean
  ) => void
  selectedItem?: Ref<HTMLElement | undefined>
  onItemLeave?: () => void
  itemTextRefCallback: (
    node: HTMLElement | undefined,
    value: string,
    disabled: boolean
  ) => void
  focusSelectedItem?: () => void
  selectedItemText?: Ref<HTMLElement | undefined>
  position?: 'item-aligned' | 'popper'
  isPositioned?: Ref<boolean>
  searchRef?: Ref<string>
}

export const SelectContentDefaultContextValue: SelectContentContext = {
  onViewportChange: () => {},
  itemTextRefCallback: () => {},
  itemRefCallback: () => {},
}

export const [injectSelectContentContext, provideSelectContentContext] = createContext<SelectContentContext>('DestylerSelectContent')

export const SelectContentImpl = defineComponent({
  name: 'DestylerSelectContentImpl',
  props: selectContentImplProps,
  emits: ['closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside'],
  setup(props) {
    const rootContext = injectSelectRootContext()

    useFocusGuards()
    const { createCollection } = useCollection()

    const content = ref<HTMLElement>()
    useHideOthers(content)

    const collectionItems = createCollection(content)
    const { search, handleTypeaheadSearch } = useTypeahead(collectionItems)

    const viewport = ref<HTMLElement>()
    const selectedItem = ref<HTMLElement>()
    const selectedItemText = ref<HTMLElement>()
    const isPositioned = ref(false)
    const firstValidItemFoundRef = ref(false)

    function focusSelectedItem() {
      if (selectedItem.value && content.value)
        focusFirst([selectedItem.value, content.value])
    }

    watch(isPositioned, () => {
      focusSelectedItem()
    })

    // prevent selecting items on `pointerup` in some cases after opening from `pointerdown`
    // and close on `pointerup` outside.
    const { onOpenChange, triggerPointerDownPosRef } = rootContext
    watchEffect((cleanupFn) => {
      if (!content.value)
        return
      let pointerMoveDelta = { x: 0, y: 0 }

      const handlePointerMove = (event: PointerEvent) => {
        pointerMoveDelta = {
          x: Math.abs(
            Math.round(event.pageX) - (triggerPointerDownPosRef.value?.x ?? 0),
          ),
          y: Math.abs(
            Math.round(event.pageY) - (triggerPointerDownPosRef.value?.y ?? 0),
          ),
        }
      }
      const handlePointerUp = (event: PointerEvent) => {
        // If the pointer hasn't moved by a certain threshold then we prevent selecting item on `pointerup`.
        if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
          event.preventDefault()
        }
        else {
          // otherwise, if the event was outside the content, close.
          if (!content.value?.contains(event.target as HTMLElement))
            onOpenChange(false)
        }
        document.removeEventListener('pointermove', handlePointerMove)
        triggerPointerDownPosRef.value = null
      }

      if (triggerPointerDownPosRef.value !== null) {
        document.addEventListener('pointermove', handlePointerMove)
        document.addEventListener('pointerup', handlePointerUp, {
          capture: true,
          once: true,
        })
      }

      cleanupFn(() => {
        document.removeEventListener('pointermove', handlePointerMove)
        document.removeEventListener('pointerup', handlePointerUp, {
          capture: true,
        })
      })
    })

    function handleKeyDown(event: KeyboardEvent) {
      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey

      // select should not be navigated using tab key so we prevent it
      if (event.key === 'Tab')
        event.preventDefault()

      if (!isModifierKey && event.key.length === 1)
        handleTypeaheadSearch(event.key)

      if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
        let candidateNodes = collectionItems.value

        if (['ArrowUp', 'End'].includes(event.key))
          candidateNodes = candidateNodes.slice().reverse()

        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
          const currentElement = event.target as HTMLElement
          const currentIndex = candidateNodes.indexOf(currentElement)
          candidateNodes = candidateNodes.slice(currentIndex + 1)
        }
        setTimeout(() => focusFirst(candidateNodes))
        event.preventDefault()
      }
    }

    const pickedProps = computed(() => {
      if (props.position === 'popper')
        return props
      else return {}
    })

    const forwardedProps = useForwardProps(pickedProps.value)

    provideSelectContentContext({
      content,
      viewport,
      onViewportChange: (node) => {
        viewport.value = node
      },
      itemRefCallback: (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.value && !disabled
        const isSelectedItem
      = rootContext.modelValue?.value !== undefined
      && rootContext.modelValue?.value === value
        if (isSelectedItem || isFirstValidItem) {
          selectedItem.value = node
          if (isFirstValidItem)
            firstValidItemFoundRef.value = true
        }
      },
      selectedItem,
      selectedItemText,
      onItemLeave: () => {
        content.value?.focus()
      },
      itemTextRefCallback: (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.value && !disabled
        const isSelectedItem
      = rootContext.modelValue?.value !== undefined
      && rootContext.modelValue?.value === value
        if (isSelectedItem || isFirstValidItem)
          selectedItemText.value = node
      },
      focusSelectedItem,
      position: props.position,
      isPositioned,
      searchRef: search,
    })

    return {
      content,
      rootContext,
      forwardedProps,
      isPositioned,
      handleKeyDown,
    }
  },
  render() {
    return h(FocusScope, {
      asChild: true,
      onUnmountAutoFocus: (event: any) => {
        this.$emit('closeAutoFocus', event)
        if (event.defaultPrevented)
          return
        this.rootContext.triggerElement.value?.focus({ preventScroll: true })
        event.preventDefault()
      },
    }, () => h(DismissableLayer, {
      asChild: true,
      disableOutsidePointerEvents: true,
      onDismiss: () => {
        this.rootContext.onOpenChange(false)
      },
      onEscapeKeyDown: (event: any) => {
        this.$emit('escapeKeyDown', event)
      },
      onPointerDownOutside: (event: any) => {
        this.$emit('pointerDownOutside', event)
      },
    }, () => withDirectives(h(this.$props.position === 'popper' ? SelectPopperPosition : SelectItemAlignedPosition, mergeProps(this.$attrs, this.forwardedProps, {
      'role': 'listbox',
      'ref': (vnode: any) => {
        this.content = unrefElement(vnode) as HTMLElement
        return undefined
      },
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'dir': this.rootContext.dir.value,
      'style': {
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
      },
      'onPlaced': () => {
        this.isPositioned = true
      },
      'onKeydown': (event: any) => {
        this.handleKeyDown(event)
      },
    }), () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ])))
  },
})
