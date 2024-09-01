import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, onUnmounted, ref, watch, watchEffect, withKeys } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useRafFn } from '@destyler/composition'
import { onKeyStroke } from '@vueuse/core'
import { TeleportPrimitive } from '@destyler/teleport'

import type { SwipeEvent } from '../utils'
import { TOAST_SWIPE_CANCEL, TOAST_SWIPE_END, TOAST_SWIPE_MOVE, TOAST_SWIPE_START, VIEWPORT_PAUSE, VIEWPORT_RESUME, getAnnounceTextContent, handleAndDispatchCustomEvent, isDeltaInDirection } from '../utils'
import { injectToastProviderContext } from './provider'
import { ToastAnnounce } from './announce'

export const toastRootImplProps = {
  ...primitiveProps,
  /**
   * @default li
   */
  as: {
    ...primitiveProps.as,
    default: 'li',
  },
  /**
   * Control the sensitivity of the toast for accessibility purposes.
   *
   * For toasts that are the result of a user action, choose `foreground`. Toasts generated from background tasks should use `background`.
   */
  type: {
    type: String as PropType<'foreground' | 'background'>,
    required: false,
  },
  /**
   * The controlled open state of the dialog. Can be bind as `v-model:open`.
   *
   * @default false
   */
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * Time in milliseconds that toast should remain visible for. Overrides value
   * given to `ToastProvider`.
   */
  duration: {
    type: Number as PropType<number>,
    required: false,
  },
} as const

export type ToastRootImplProps = ExtractPublicPropTypes<typeof toastRootImplProps>

export const toastRootImplEmits = {
  close: () => true,
  /**
   * Event handler called when the escape key is down. It can be prevented by calling `event.preventDefault`.
   */
  escapeKeyDown: (_event: KeyboardEvent) => true,
  /**
   * Event handler called when the dismiss timer is paused. This occurs when the pointer is moved over the viewport, the viewport is focused or when the window is blurred.
   */
  pause: () => true,
  /**
   * Event handler called when the dismiss timer is resumed. This occurs when the pointer is moved away from the viewport, the viewport is blurred or when the window is focused.
   */
  resume: () => true,
  /**
   * Event handler called when starting a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  swipeStart: (_event: SwipeEvent) => true,
  /**
   * Event handler called during a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  swipeMove: (_event: SwipeEvent) => true,
  swipeCancel: (_event: SwipeEvent) => true,
  /**
   * Event handler called at the end of a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  swipeEnd: (_event: SwipeEvent) => true,
}

export const [injectToastRootContext, provideToastRootContext] = createContext<{ onClose: () => void }>('DestylerToastRoot')

export const ToastRootImpl = defineComponent({
  name: 'DestylerToastRootImpl',
  inheritAttrs: false,
  props: toastRootImplProps,
  emits: toastRootImplEmits,
  slots: Object as SlotsType<{
    default: (props: {
      /**
       * Remaining time (in ms)
       */
      remaining: number
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const providerContext = injectToastProviderContext()
    const pointerStartRef = ref<{ x: number, y: number } | null>(null)
    const swipeDeltaRef = ref<{ x: number, y: number } | null>(null)
    const duration = computed(() => props.duration || providerContext.duration.value)

    const closeTimerStartTimeRef = ref(0)
    const closeTimerRemainingTimeRef = ref(duration.value)
    const closeTimerRef = ref(0)
    const remainingTime = ref(duration.value)

    const remainingRaf = useRafFn(() => {
      const elapsedTime = new Date().getTime() - closeTimerStartTimeRef.value
      remainingTime.value = Math.max(closeTimerRemainingTimeRef.value - elapsedTime, 0)
    }, { fpsLimit: 30 })

    function startTimer(duration: number) {
      if (!duration || duration === Number.POSITIVE_INFINITY)
        return
      window.clearTimeout(closeTimerRef.value)
      closeTimerStartTimeRef.value = new Date().getTime()
      closeTimerRef.value = window.setTimeout(handleClose, duration)
    }

    function handleClose() {
      const isFocusInToast = currentElement.value?.contains(document.activeElement)
      if (isFocusInToast)
        providerContext.viewport.value?.focus()

      providerContext.isClosePausedRef.value = false
      emit('close')
    }

    const announceTextContent = computed(() => currentElement.value ? getAnnounceTextContent(currentElement.value) : null)

    if (props.type && !['foreground', 'background'].includes(props.type)) {
      const error = 'Invalid prop `type` supplied to `Toast`. Expected `foreground | background`.'
      throw new Error(error)
    }

    watchEffect((_) => {
      const viewport = providerContext.viewport.value
      if (viewport) {
        const handleResume = () => {
          startTimer(closeTimerRemainingTimeRef.value)
          remainingRaf.resume()
          emit('resume')
        }
        const handlePause = () => {
          const elapsedTime = new Date().getTime() - closeTimerStartTimeRef.value
          closeTimerRemainingTimeRef.value = closeTimerRemainingTimeRef.value - elapsedTime
          window.clearTimeout(closeTimerRef.value)
          remainingRaf.pause()
          emit('pause')
        }
        viewport.addEventListener(VIEWPORT_PAUSE, handlePause)
        viewport.addEventListener(VIEWPORT_RESUME, handleResume)
        return () => {
          viewport.removeEventListener(VIEWPORT_PAUSE, handlePause)
          viewport.removeEventListener(VIEWPORT_RESUME, handleResume)
        }
      }
    })

    // start timer when toast opens or duration changes.
    // we include `open` in deps because closed !== unmounted when animating
    // so it could reopen before being completely unmounted
    watch(() => [props.open, duration.value], () => {
      // Reset the timer when the toast is rerendered with the new duration
      closeTimerRemainingTimeRef.value = duration.value

      if (props.open && !providerContext.isClosePausedRef.value)
        startTimer(duration.value)
    }, { immediate: true })

    onKeyStroke('Escape', (event) => {
      emit('escapeKeyDown', event)
      if (!event.defaultPrevented) {
        providerContext.isFocusedToastEscapeKeyDownRef.value = true
        handleClose()
      }
    })

    onMounted(() => {
      providerContext.onToastAdd()
    })
    onUnmounted(() => {
      providerContext.onToastRemove()
    })

    provideToastRootContext({ onClose: handleClose })

    return {
      remainingTime,
      announceTextContent,
      providerContext,
      forwardRef,
      pointerStartRef,
      swipeDeltaRef,
    }
  },
  render() {
    const components = []
    if (this.announceTextContent) {
      components.push(h(ToastAnnounce, {
        'role': 'status',
        'aria-live': this.$props.type === 'foreground' ? 'assertive' : 'polite',
        'aria-atomic': '',
      }, () => this.announceTextContent))
    }
    components.push(h(TeleportPrimitive, {
      to: this.providerContext.viewport.value,
    }, () => h(Primitive, mergeProps(this.$attrs, {
      'ref': (el: any) => this.forwardRef(el),
      'role': 'status',
      'aria-live': 'off',
      'aria-atomic': '',
      'tabindex': '0',
      'data-destyler-collection-item': '',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': this.$props.open ? 'open' : 'closed',
      'data-swipe-direction': this.providerContext.swipeDirection.value,
      'style': {
        userSelect: 'none',
        touchAction: 'none',
      },
      'onPointerdown': withKeys((event: any) => {
        this.pointerStartRef = { x: event.clientX, y: event.clientY }
      }, ['left']),
      'onPointermove': (event: PointerEvent) => {
        if (!this.pointerStartRef)
          return
        const x = event.clientX - this.pointerStartRef.x
        const y = event.clientY - this.pointerStartRef.y
        const hasSwipeMoveStarted = Boolean(this.swipeDeltaRef)
        const isHorizontalSwipe = ['left', 'right'].includes(this.providerContext.swipeDirection.value)
        const clamp = ['left', 'up'].includes(this.providerContext.swipeDirection.value)
          ? Math.min
          : Math.max
        const clampedX = isHorizontalSwipe ? clamp(0, x) : 0
        const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0
        const moveStartBuffer = event.pointerType === 'touch' ? 10 : 2
        const delta = { x: clampedX, y: clampedY }
        const eventDetail = { originalEvent: event, delta }
        if (hasSwipeMoveStarted) {
          this.swipeDeltaRef = delta
          handleAndDispatchCustomEvent(TOAST_SWIPE_MOVE, (ev: SwipeEvent) => this.$emit('swipeMove', ev), eventDetail)
        }
        else if (isDeltaInDirection(delta, this.providerContext.swipeDirection.value, moveStartBuffer)) {
          this.swipeDeltaRef = delta
          handleAndDispatchCustomEvent(TOAST_SWIPE_START, (ev: SwipeEvent) => this.$emit('swipeStart', ev), eventDetail);
          (event.target as HTMLElement).setPointerCapture(event.pointerId)
        }
        else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) {
          this.pointerStartRef = null
        }
      },
      'onPointerup': (event: PointerEvent) => {
        const delta = this.swipeDeltaRef
        const target = event.target as HTMLElement
        if (target.hasPointerCapture(event.pointerId))
          target.releasePointerCapture(event.pointerId)

        this.swipeDeltaRef = null
        this.pointerStartRef = null
        if (delta) {
          const toast = event.currentTarget
          const eventDetail = { originalEvent: event, delta }
          if (
            isDeltaInDirection(delta, this.providerContext.swipeDirection.value, this.providerContext.swipeThreshold.value)
          )
            handleAndDispatchCustomEvent(TOAST_SWIPE_END, (ev: SwipeEvent) => this.$emit('swipeEnd', ev), eventDetail)

          else
            handleAndDispatchCustomEvent(TOAST_SWIPE_CANCEL, (ev: SwipeEvent) => this.$emit('swipeCancel', ev), eventDetail)

          toast?.addEventListener('click', event => event.preventDefault(), {
            once: true,
          })
        }
      },
    }), () => this.$slots.default?.({ remaining: this.remainingTime }))))
    return components
  },
})
