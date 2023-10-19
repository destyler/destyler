import type { ImgHTMLAttributes, PropType, VNodeChild } from 'vue'
import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { isImageSupportNativeLazy, observeIntersection, resolveSlot, resolveWrappedSlot } from '@destyler/shared'
import { DestylerResizeObserver } from '@destyler/resize-observer'

export type IntersectionObserverOptions = Omit<
IntersectionObserverInit,
'root'
> & {
  root?: Element | Document | null | string
}

export default defineComponent({
  name: 'DestylerAvatar',
  props: {
    src: {
      type: String as PropType<string>,
    },
    fallbackSrc: {
      type: String as PropType<string>,
    },
    imgProps: {
      type: Object as PropType<ImgHTMLAttributes>,
    },
    intersectionObserverOptions: {
      type: Object as PropType<IntersectionObserverOptions>,
    },
    lazy: {
      type: Boolean as PropType<boolean>,
    },
    renderFallback: {
      type: Function as PropType<() => VNodeChild>,
    },
    renderPlaceholder: {
      type: Function as PropType<() => VNodeChild>,
    },
    onError: {
      type: Function as PropType<(e: Event) => void>,
    },
    onLoad: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  setup(props, { slots }) {
    const textRef = ref<HTMLElement | null>(null)
    const selfRef = ref<HTMLElement | null>(null)
    const loaded = ref(!props.lazy)
    const shouldStartLoading = ref(!props.lazy)
    const hasLoadError = ref(false)

    function mergedOnLoad(e: Event) {
      props.onLoad?.(e)
      props.imgProps?.onLoad?.(e)
      loaded.value = true
    }

    function handleError(e: Event): void {
      if (!shouldStartLoading.value)
        return
      hasLoadError.value = true
      props.imgProps?.onError?.(e)
      if (props.onError)
        props.onError(e)
    }

    watch(
      () => props.src,
      () => {
        hasLoadError.value = false
      },
    )

    onMounted(() => {
      if (isImageSupportNativeLazy)
        return

      let unobserve: (() => void) | undefined
      const stopWatchHandle = watchEffect(() => {
        unobserve?.()
        unobserve = undefined
        if (props.lazy) {
          unobserve = observeIntersection(
            selfRef.value,
            props.intersectionObserverOptions,
            shouldStartLoading,
          )
        }
      })
      onBeforeUnmount(() => {
        stopWatchHandle()
        unobserve?.()
      })
    })

    let memoedTextHtml: string | null = null

    function fitTextTransform(): void {
      const { value: textEl } = textRef
      if (textEl) {
        if (memoedTextHtml === null || memoedTextHtml !== textEl.innerHTML) {
          memoedTextHtml = textEl.innerHTML
          const { value: selfEl } = selfRef
          if (selfEl) {
            const { offsetWidth: elWidth, offsetHeight: elHeight } = selfEl
            const { offsetWidth: textWidth, offsetHeight: textHeight } = textEl
            const radix = 0.9
            const ratio = Math.min(
              (elWidth / textWidth) * radix,
              (elHeight / textHeight) * radix,
              1,
            )
            textEl.style.transform = `translateX(-50%) translateY(-50%) scale(${ratio})`
          }
        }
      }
    }

    return () => {
      let img: VNodeChild
      const placeholderNode = !loaded.value
      && !hasLoadError.value
      && (props.renderPlaceholder
        ? props.renderPlaceholder()
        : slots.placeholder?.())

      if (hasLoadError.value) {
        img = props.renderPlaceholder
          ? props.renderPlaceholder()
          : resolveSlot(slots.fallback, () => [
            h('img', {
              destyler: 'avatar-fallback',
              src: props.fallbackSrc,
            }),
          ])
      }
      else {
        img = resolveWrappedSlot(slots.default, (children) => {
          if (children) {
            return h(DestylerResizeObserver, {
              onResize: fitTextTransform,
            },
            () => h('span', {
              ref: 'textRef',
              destyler: 'avatar-text',
            }, children))
          }
          else if (props.src) {
            return h('img', {
              destyler: 'avatar-img',
              ...props.imgProps,
              loading:
              isImageSupportNativeLazy
              && !props.intersectionObserverOptions
              && props.lazy
                ? 'lazy'
                : 'eager',
              src:
              isImageSupportNativeLazy
                ? props.src
                : shouldStartLoading.value || loaded.value
                  ? props.src
                  : null,
              onLoad: mergedOnLoad,
              onError: handleError,
            })
          }
        })
      }
      return h('span', {
        destyler: 'avatar',
      }, [
        img,
        props.lazy && placeholderNode,
      ])
    }
  },
})
