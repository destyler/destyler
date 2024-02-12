import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, onUnmounted, ref, toRefs, watch } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes, GraceIntent } from '@destyler/shared'
import { useArrowNavigation, useCollection, useFocusGuards, useForwardExpose, useTypeahead } from '@destyler/composition'
import { createContext, focusFirst, isMouseEvent, isPointerInGraceArea } from '@destyler/shared'
import { DestylerFocusScope } from '@destyler/focus-scope'
import { DestylerDismissableLayer } from '@destyler/dismissable-layer'
import { DestylerRovingFocusGroup } from '@destyler/roving-focus'
import { DestylerPopperContent } from '@destyler/popper'

import {
  FIRST_LAST_KEYS,
  LAST_KEYS,
  getOpenState,
} from '../utils'
import { injectMenuContext, injectMenuRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerMenuContentImplProps = {
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
  side: {
    type: String as PropType<Side>,
    required: false,
    default: 'bottom',
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
  updatePositionStrategy: {
    type: String as PropType<'optimized' | 'always'>,
    required: false,
    default: 'optimized',
  },
  onPlaced: {
    type: Function as PropType<() => void>,
    required: false,
  },
  prioritizePosition: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disableOutsidePointerEvents: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  disableOutsideScroll: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  trapFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerMenuContentImplProps = ExtractPublicPropTypes<typeof destylerMenuContentImplProps>

export interface MenuContentContext {
  onItemEnter(event: PointerEvent): boolean
  onItemLeave(event: PointerEvent): void
  onTriggerLeave(event: PointerEvent): boolean
  searchRef: Ref<string>
  pointerGraceTimerRef: Ref<number>
  onPointerGraceIntentChange(intent: GraceIntent | null): void
}

export const [injectMenuContentContext, provideMenuContentContext] = createContext<MenuContentContext>('DestylerMenuContent')

export const DestylerMenuContentImpl = defineComponent({
  name: 'DestylerMenuContentImpl',
  props: destylerMenuContentImplProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'entryFocus'],
  setup(props, { emit }) {
    const menuContext = injectMenuContext()
    const rootContext = injectMenuRootContext()

    const { trapFocus, disableOutsidePointerEvents, loop } = toRefs(props)

    useFocusGuards()

    const searchRef = ref('')
    const timerRef = ref(0)
    const pointerGraceTimerRef = ref(0)
    const pointerGraceIntentRef = ref<GraceIntent | null>(null)
    const pointerDirRef = ref<Side>('right')
    const lastPointerXRef = ref(0)
    const currentItemId = ref<string | null>(null)

    const { createCollection } = useCollection()
    const { forwardRef, currentElement: contentElement } = useForwardExpose()
    const collectionItems = createCollection(contentElement)

    watch(contentElement, (el) => {
      menuContext!.onContentChange(el)
    })

    const { handleTypeaheadSearch } = useTypeahead(collectionItems)

    onUnmounted(() => {
      window.clearTimeout(timerRef.value)
    })

    function isPointerMovingToSubmenu(event: PointerEvent) {
      const isMovingTowards
    = pointerDirRef.value === pointerGraceIntentRef.value?.side

      return (
        isMovingTowards
        && isPointerInGraceArea(event, pointerGraceIntentRef.value?.area)
      )
    }

    async function handleMountAutoFocus(event: Event) {
      emit('openAutoFocus', event)
      if (event.defaultPrevented)
        return
      event.preventDefault()
      contentElement.value?.focus()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented)
        return
      const target = event.target as HTMLElement
      const isKeyDownInside
    = target.closest('[data-destyler-menu-content]') === event.currentTarget
      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
      const isCharacterKey = event.key.length === 1

      const el = useArrowNavigation(
        event,
        document.activeElement as HTMLElement,
        contentElement.value,
        {
          loop: loop.value,
          arrowKeyOptions: 'vertical',
          dir: rootContext?.dir.value,
          focus: true,
          attributeName: '[data-destyler-collection-item]:not([data-disabled])',
        },
      )
      if (el)
        return el?.focus()

      if (event.code === 'Space')
        return

      if (isKeyDownInside) {
        if (event.key === 'Tab')
          event.preventDefault()
        if (!isModifierKey && isCharacterKey)
          handleTypeaheadSearch(event.key)
      }

      if (event.target !== contentElement.value)
        return
      if (!FIRST_LAST_KEYS.includes(event.key))
        return
      event.preventDefault()
      const candidateNodes = collectionItems.value
      if (LAST_KEYS.includes(event.key))
        candidateNodes.reverse()
      focusFirst(candidateNodes)
    }

    function handleBlur(event: any) {
      if (!event?.currentTarget?.contains?.(event.target)) {
        window.clearTimeout(timerRef.value)
        searchRef.value = ''
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (!isMouseEvent(event))
        return
      const target = event.target as HTMLElement
      const pointerXHasChanged = lastPointerXRef.value !== event.clientX

      if (
        (event?.currentTarget as HTMLElement)?.contains(target)
        && pointerXHasChanged
      ) {
        const newDir = event.clientX > lastPointerXRef.value ? 'right' : 'left'
        pointerDirRef.value = newDir
        lastPointerXRef.value = event.clientX
      }
    }

    provideMenuContentContext({
      onItemEnter: (event) => {
        if (isPointerMovingToSubmenu(event))
          return true
        else
          return false
      },
      onItemLeave: (event) => {
        if (isPointerMovingToSubmenu(event))
          return
        contentElement.value?.focus()
        currentItemId.value = null
      },
      onTriggerLeave: (event) => {
        if (isPointerMovingToSubmenu(event))
          return true
        else
          return false
      },
      searchRef,
      pointerGraceTimerRef,
      onPointerGraceIntentChange: (intent) => {
        pointerGraceIntentRef.value = intent
      },
    })

    return {
      trapFocus,
      disableOutsidePointerEvents,
      currentItemId,
      rootContext,
      loop,
      forwardRef,
      menuContext,
      handleMountAutoFocus,
      handleKeyDown,
      handleBlur,
      handlePointerMove,
    }
  },
  render() {
    return h(DestylerFocusScope, {
      asChild: true,
      trapped: this.trapFocus,
      onMountAutoFocus: (event) => {
        this.handleMountAutoFocus(event)
      },
      onUnmountAutoFocus: (event) => {
        this.$emit('closeAutoFocus', event)
      },
    }, h(DestylerDismissableLayer, {
      asChild: true,
      disableOutsidePointerEvents: this.disableOutsidePointerEvents,
      onEscapeKeyDown: (event) => {
        this.$emit('escapeKeyDown', event)
      },
      onPointerDownOutside: (event) => {
        this.$emit('pointerDownOutside', event)
      },
      onFocusOutside: (event) => {
        this.$emit('focusOutside', event)
      },
      onInteractOutside: (event) => {
        this.$emit('interactOutside', event)
      },
      onDismiss: (event) => {
        this.$emit('dismiss', event)
      },
    }, h(DestylerRovingFocusGroup, {
      'asChild': true,
      'currentTabStopId': this.currentItemId!,
      'onUpdate:currentTabStopId': (value: string) => {
        this.currentItemId = value
      },
      'orientation': 'vertical',
      'dir': this.rootContext.dir.value,
      'loop': this.loop,
      'onEntryFocus': (event) => {
        this.$emit('entryFocus', event)
        if (!this.rootContext.isUsingKeyboardRef.value)
          event.preventDefault()
      },
    }, h(DestylerPopperContent, {
      'ref': this.forwardRef,
      'role': 'menu',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-orientation': 'vertical',
      'data-destyler-menu-content': '',
      'data-state': getOpenState(this.menuContext.open.value),
      'dir': this.rootContext.dir.value,
      'side': this.$props.side,
      'sideOffset': this.$props.sideOffset,
      'align': this.$props.align,
      'alignOffset': this.$props.alignOffset,
      'avoidCollisions': this.$props.avoidCollisions,
      'collisionBoundary': this.$props.collisionBoundary,
      'collisionPadding': this.$props.collisionPadding,
      'arrowPadding': this.$props.arrowPadding,
      'prioritizePosition': this.$props.prioritizePosition,
      'sticky': this.$props.sticky,
      'hideWhenDetached': this.$props.hideWhenDetached,
      'onKeydown': (event: any) => {
        this.handleKeyDown(event)
      },
      'onBlue': (event: any) => {
        this.handleBlur(event)
      },
      'onPointermove': (event: any) => {
        this.handlePointerMove(event)
      },
    }, {
      default: () => this.$slots.default?.(),
    }))))
  },
})
