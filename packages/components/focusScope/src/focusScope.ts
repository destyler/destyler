import type { PropType } from 'vue'
import { defineComponent, h, nextTick, reactive, ref, watchEffect } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { isClient } from '@destyler/shared'
import { useCustomElement } from '@destyler/composition'
import { createFocusScopesStack, removeLinks } from './stack'
import { AUTOFOCUS_ON_MOUNT, AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS, focus, focusFirst, getTabbableCandidates, getTabbableEdges } from './utils'

export const destylerFocusScopeProps = {
  ...destylerPrimitiveProps,
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
}

export const DestylerFocusScope = defineComponent({
  name: 'DestylerFocusScope',
  props: destylerFocusScopeProps,
  emits: ['mountAutoFocus', 'unmountAutoFocus'],
  setup(props, { emit }) {
    const { customElement, currentElement } = useCustomElement()
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
      customElement,
      handleKeyDown,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      ref: 'customElement',
      tabindex: '-1',
      as: this.$props.as,
      asChild: this.$props.asChild,
      onKeyDown: this.handleKeyDown,
    }, this.$slots.default?.())
  },
})
