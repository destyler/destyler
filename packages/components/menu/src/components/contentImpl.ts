import type { PropType, Ref } from 'vue'
import { defineComponent, h, onUnmounted, ref, toRefs, watch } from 'vue'
import type { ExtractPublicPropTypes, GraceIntent } from '@destyler/shared'
import { useArrowNavigation, useCollection, useFocusGuards, useForwardExpose, useTypeahead } from '@destyler/composition'
import { createContext, focusFirst, isMouseEvent, isPointerInGraceArea } from '@destyler/shared'
import { FocusScope } from '@destyler/focus-scope'
import { DismissableLayer } from '@destyler/dismissable-layer'
import { dismissableLayerEmits } from '@destyler/dismissable-layer/component'
import { RovingFocusGroup } from '@destyler/roving-focus'
import { rovingFocusGroupEmits } from '@destyler/roving-focus/component'
import { PopperContent, popperContentProps } from '@destyler/popper'

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

export const menuContentImplProps = {
  as: {
    ...popperContentProps.as,
  },
  asChild: {
    ...popperContentProps.asChild,
  },
  side: {
    ...popperContentProps.side,
  },
  sideOffset: {
    ...popperContentProps.sideOffset,
  },
  align: {
    ...popperContentProps.align,
  },
  alignOffset: {
    ...popperContentProps.alignOffset,
  },
  avoidCollisions: {
    ...popperContentProps.avoidCollisions,
  },
  collisionBoundary: {
    ...popperContentProps.collisionBoundary,
  },
  collisionPadding: {
    ...popperContentProps.collisionPadding,
  },
  arrowPadding: {
    ...popperContentProps.arrowPadding,
  },
  sticky: {
    ...popperContentProps.sticky,
  },
  hideWhenDetached: {
    ...popperContentProps.hideWhenDetached,
  },
  updatePositionStrategy: {
    ...popperContentProps.updatePositionStrategy,
  },
  prioritizePosition: {
    ...popperContentProps.prioritizePosition,
  },
  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside
   * the `DismissableLayer`. Users will need to click twice on outside elements to
   * interact with them: once to close the `DismissableLayer`, and again to trigger the element.
   */
  disableOutsidePointerEvents: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * Whether scrolling outside the `MenuContent` should be prevented
   */
  disableOutsideScroll: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * Whether focus should be trapped within the `MenuContent`
   * @default als
   */
  trapFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * When `true`, tabbing from last item will focus first tabbable
   * and shift+tab from first item will focus last tababble.
   */
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type MenuContentImplProps = ExtractPublicPropTypes<typeof menuContentImplProps>

export const menuContentImplEmits = {
  ...dismissableLayerEmits,
  entryFocus: rovingFocusGroupEmits.entryFocus,
  openAutoFocus: (_event: Event) => true,
  closeAutoFocus: (_event: Event) => true,
}

export interface MenuContentContext {
  onItemEnter: (event: PointerEvent) => boolean
  onItemLeave: (event: PointerEvent) => void
  onTriggerLeave: (event: PointerEvent) => boolean
  searchRef: Ref<string>
  pointerGraceTimerRef: Ref<number>
  onPointerGraceIntentChange: (intent: GraceIntent | null) => void
}

export const [injectMenuContentContext, provideMenuContentContext] = createContext<MenuContentContext>('DestylerMenuContent')

export const MenuContentImpl = defineComponent({
  name: 'DestylerMenuContentImpl',
  props: menuContentImplProps,
  emits: {
    ...menuContentImplEmits,
    /**
     * Handler called when the `DismissableLayer` should be dismissed
     */
    dismiss: () => true,
  },
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
    return h(FocusScope, {
      asChild: true,
      trapped: this.trapFocus,
      onMountAutoFocus: (event: any) => {
        this.handleMountAutoFocus(event)
      },
      onUnmountAutoFocus: (event: any) => {
        this.$emit('closeAutoFocus', event)
      },
    }, () => h(DismissableLayer, {
      asChild: true,
      disableOutsidePointerEvents: this.disableOutsidePointerEvents,
      onEscapeKeyDown: (event: any) => {
        this.$emit('escapeKeyDown', event)
      },
      onPointerDownOutside: (event: any) => {
        this.$emit('pointerDownOutside', event)
      },
      onFocusOutside: (event: any) => {
        this.$emit('focusOutside', event)
      },
      onInteractOutside: (event: any) => {
        this.$emit('interactOutside', event)
      },
      onDismiss: () => {
        this.$emit('dismiss')
      },
    }, () => h(RovingFocusGroup, {
      'asChild': true,
      'currentTabStopId': this.currentItemId!,
      'onUpdate:currentTabStopId': (value: string | null | undefined) => {
        this.currentItemId = value || ''
      },
      'orientation': 'vertical',
      'dir': this.rootContext.dir.value,
      'loop': this.loop,
      'onEntryFocus': (event) => {
        this.$emit('entryFocus', event)
        if (!this.rootContext.isUsingKeyboardRef.value)
          event.preventDefault()
      },
    }, () => h(PopperContent, {
      'ref': (el: any) => this.forwardRef(el),
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
    }, () => this.$slots.default?.()))))
  },
})
