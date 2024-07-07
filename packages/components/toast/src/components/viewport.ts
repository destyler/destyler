import type { PropType, SlotsType } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, ref, toRefs, watchEffect } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useCollection, useForwardExpose } from '@destyler/composition'
import { onKeyStroke } from '@vueuse/core'
import { focusFirst, getTabbableCandidates } from '@destyler/focus-scope/dist/utils'
import { DismissableLayerBranch } from '@destyler/dismissable-layer'
import { unrefElement } from '@destyler/shared'

import { VIEWPORT_PAUSE, VIEWPORT_RESUME } from '../utils'
import { injectToastProviderContext } from './provider'
import { ToastFocusProxy } from './focusProxy'

export const toastViewportProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'ol',
  },
  hotkey: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => ['F8'],
  },
  label: {
    type: String as PropType<string>,
    required: false,
    default: 'Notifications ({hotkey})',
  },
} as const

export type ToastViewportProps = ExtractPublicPropTypes<typeof toastViewportProps>

export const ToastViewport = defineComponent({
  name: 'DestylerToastViewport',
  inheritAttrs: false,
  props: toastViewportProps,
  slots: Object as SlotsType<{
    default: () => void
  }>,
  setup(props) {
    const { hotkey, label } = toRefs(props)

    const { forwardRef, currentElement } = useForwardExpose()
    const { createCollection } = useCollection()
    const collections = createCollection(currentElement)
    const providerContext = injectToastProviderContext()
    const hasToasts = computed(() => providerContext.toastCount.value > 0)
    const headFocusProxyRef = ref<HTMLElement>()
    const tailFocusProxyRef = ref<HTMLElement>()

    onKeyStroke(hotkey.value, () => {
      currentElement.value.focus()
    })

    onMounted(() => {
      providerContext.onViewportChange(currentElement.value)
    })

    watchEffect((cleanupFn) => {
      const viewport = currentElement.value
      if (hasToasts.value && viewport) {
        const handlePause = () => {
          if (!providerContext.isClosePausedRef.value) {
            const pauseEvent = new CustomEvent(VIEWPORT_PAUSE)
            viewport.dispatchEvent(pauseEvent)
            providerContext.isClosePausedRef.value = true
          }
        }

        const handleResume = () => {
          if (providerContext.isClosePausedRef.value) {
            const resumeEvent = new CustomEvent(VIEWPORT_RESUME)
            viewport.dispatchEvent(resumeEvent)
            providerContext.isClosePausedRef.value = false
          }
        }

        const handleFocusOutResume = (event: FocusEvent) => {
          const isFocusMovingOutside = !viewport.contains(event.relatedTarget as HTMLElement)
          if (isFocusMovingOutside)
            handleResume()
        }

        const handlePointerLeaveResume = () => {
          const isFocusInside = viewport.contains(document.activeElement)
          if (!isFocusInside)
            handleResume()
        }

        const handleKeyDown = (event: KeyboardEvent) => {
          const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
          const isTabKey = event.key === 'Tab' && !isMetaKey

          if (isTabKey) {
            const focusedElement = document.activeElement
            const isTabbingBackwards = event.shiftKey
            const targetIsViewport = event.target === viewport

            if (targetIsViewport && isTabbingBackwards) {
              headFocusProxyRef.value?.focus()
              return
            }

            const tabbingDirection = isTabbingBackwards ? 'backwards' : 'forwards'
            const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection })
            const index = sortedCandidates.findIndex(candidate => candidate === focusedElement)
            if (focusFirst(sortedCandidates.slice(index + 1))) {
              event.preventDefault()
            }
            else {
              isTabbingBackwards
                ? headFocusProxyRef.value?.focus()
                : tailFocusProxyRef.value?.focus()
            }
          }
        }

        viewport.addEventListener('focusin', handlePause)
        viewport.addEventListener('focusout', handleFocusOutResume)
        viewport.addEventListener('pointermove', handlePause)
        viewport.addEventListener('pointerleave', handlePointerLeaveResume)
        viewport.addEventListener('keydown', handleKeyDown)
        window.addEventListener('blur', handlePause)
        window.addEventListener('focus', handleResume)

        cleanupFn(() => {
          viewport.removeEventListener('focusin', handlePause)
          viewport.removeEventListener('focusout', handleFocusOutResume)
          viewport.removeEventListener('pointermove', handlePause)
          viewport.removeEventListener('pointerleave', handlePointerLeaveResume)
          viewport.removeEventListener('keydown', handleKeyDown)
          window.removeEventListener('blur', handlePause)
          window.removeEventListener('focus', handleResume)
        })
      }
    })

    function getSortedTabbableCandidates({ tabbingDirection }: { tabbingDirection: 'forwards' | 'backwards' }) {
      const toastItems = collections.value
      const tabbableCandidates = toastItems.map((toastNode) => {
        const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)]
        return tabbingDirection === 'forwards'
          ? toastTabbableCandidates
          : toastTabbableCandidates.reverse()
      })
      return (
        tabbingDirection === 'forwards' ? tabbableCandidates.reverse() : tabbableCandidates
      ).flat()
    }

    return {
      label,
      hotkey,
      hasToasts,
      headFocusProxyRef,
      tailFocusProxyRef,
      getSortedTabbableCandidates,
      forwardRef,
    }
  },
  render() {
    return h(DismissableLayerBranch, {
      'role': 'region',
      'aria-label': this.label.replace('{hotkey}', this.hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')),
      'tabindex': '-1',
      'style': {
        pointerEvents: this.hasToasts ? undefined : 'none',
      },
    }, () => [
      this.hasToasts
        ? h(ToastFocusProxy, {
          ref: (node: any) => {
            this.headFocusProxyRef = unrefElement(node) as HTMLElement
            return undefined
          },
          onFocusFromOutsideViewport: () => {
            const tabbableCandidates = this.getSortedTabbableCandidates({
              tabbingDirection: 'backwards',
            })
            focusFirst(tabbableCandidates)
          },
        })
        : null,
      h(Primitive, mergeProps(this.$attrs, {
        ref: (el: any) => this.forwardRef(el),
        tabindex: '-1',
        as: this.$props.as,
        asChild: this.$props.asChild,
      }), () => this.$slots.default?.()),
      this.hasToasts
        ? h(ToastFocusProxy, {
          ref: (node: any) => {
            this.tailFocusProxyRef = unrefElement(node) as HTMLElement
            return undefined
          },
          onFocusFromOutsideViewport: () => {
            const tabbableCandidates = this.getSortedTabbableCandidates({
              tabbingDirection: 'backwards',
            })
            focusFirst(tabbableCandidates)
          },
        })
        : null,
    ])
  },
})
