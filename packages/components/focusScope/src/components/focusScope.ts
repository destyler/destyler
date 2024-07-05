import type { PropType } from 'vue'
import { defineComponent, h, nextTick, reactive, ref, watchEffect } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { isClient } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { AUTOFOCUS_ON_MOUNT, AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS, focus, focusFirst, getTabbableCandidates, getTabbableEdges } from '../utils'
import { createFocusScopesStack, removeLinks } from './stack'

export const focusScopeProps = {
  ...primitiveProps,
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  trapped: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type FocusScopeProps = ExtractPublicPropTypes<typeof focusScopeProps>

export const FocusScope = defineComponent({
  name: 'DestylerFocusScope',
  props: focusScopeProps,
  emits: ['mountAutoFocus', 'unmountAutoFocus'],
  setup(props, { emit }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const lastFocusedElementRef = ref<HTMLElement | null>(null)
    const focusScopesStack = createFocusScopesStack()
    const focusScope = reactive({
      paused: false,
      pause() {
        this.paused = true
      },
      resume() {
        this.paused = false
      },
    })

    watchEffect((cleanupFn) => {
      if (!isClient)
        return
      const container = currentElement.value
      if (!props.trapped)
        return

      function handleFocusIn(event: FocusEvent) {
        if (focusScope.paused || !container)
          return
        const target = event.target as HTMLElement | null
        if (container.contains(target))
          lastFocusedElementRef.value = target
        else focus(lastFocusedElementRef.value, { select: true })
      }

      function handleFocusOut(event: FocusEvent) {
        if (focusScope.paused || !container)
          return
        const relatedTarget = event.relatedTarget as HTMLElement | null
        if (relatedTarget === null)
          return

        if (!container.contains(relatedTarget))
          focus(lastFocusedElementRef.value, { select: true })
      }
      function handleMutations() {
        const isLastFocusedElementExist = container.contains(lastFocusedElementRef.value)
        if (!isLastFocusedElementExist)
          focus(container)
      }

      document.addEventListener('focusin', handleFocusIn)
      document.addEventListener('focusout', handleFocusOut)
      const mutationObserver = new MutationObserver(handleMutations)
      if (container)
        mutationObserver.observe(container, { childList: true, subtree: true })

      cleanupFn(() => {
        document.removeEventListener('focusin', handleFocusIn)
        document.removeEventListener('focusout', handleFocusOut)
        mutationObserver.disconnect()
      })
    })

    watchEffect(async (cleanupFn) => {
      const container = currentElement.value

      await nextTick()
      if (!container)
        return
      focusScopesStack.add(focusScope)
      const previouslyFocusedElement = document.activeElement as HTMLElement | null
      const hasFocusedCandidate = container.contains(previouslyFocusedElement)

      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS)
        container.addEventListener(AUTOFOCUS_ON_MOUNT, (ev: Event) =>
          emit('mountAutoFocus', ev))
        container.dispatchEvent(mountEvent)

        if (!mountEvent.defaultPrevented) {
          focusFirst(removeLinks(getTabbableCandidates(container)), {
            select: true,
          })
          if (document.activeElement === previouslyFocusedElement)
            focus(container)
        }
      }

      cleanupFn(() => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, (ev: Event) =>
          emit('mountAutoFocus', ev))

        const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS)
        const unmountEventHandler = (ev: Event) => {
          emit('unmountAutoFocus', ev)
        }
        container.addEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler)
        container.dispatchEvent(unmountEvent)

        setTimeout(() => {
          if (!unmountEvent.defaultPrevented)
            focus(previouslyFocusedElement ?? document.body, { select: true })

          // we need to remove the listener after we `dispatchEvent`
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler)

          focusScopesStack.remove(focusScope)
        }, 0)
      })
    })

    function handleKeyDown(event: KeyboardEvent) {
      if (!props.loop && !props.trapped)
        return
      if (focusScope.paused)
        return

      const isTabKey
        = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey
      const focusedElement = document.activeElement as HTMLElement | null

      if (isTabKey && focusedElement) {
        const container = event.currentTarget as HTMLElement
        const [first, last] = getTabbableEdges(container)
        const hasTabbableElementsInside = first && last

        if (!hasTabbableElementsInside) {
          if (focusedElement === container)
            event.preventDefault()
        }
        else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault()
            if (props.loop)
              focus(first, { select: true })
          }
          else if (event.shiftKey && focusedElement === first) {
            event.preventDefault()
            if (props.loop)
              focus(last, { select: true })
          }
        }
      }
    }

    return {
      forwardRef,
      handleKeyDown,
    }
  },
  render() {
    return h(Primitive, {
      ref: (el: any) => this.forwardRef(el),
      tabindex: '-1',
      as: this.$props.as,
      asChild: this.$props.asChild,
      onKeydown: this.handleKeyDown,
    }, () => this.$slots.default?.())
  },
})
