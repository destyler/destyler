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

const DestylerAvatar = defineComponent({
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
    let memoedTextHtml: string | null = null
    const textRef = ref<HTMLElement | null>(null)
    const selfRef = ref<HTMLElement | null>(null)
    const loaded = ref(!props.lazy)
    const shouldStartLoading = ref(!props.lazy)
    const hasLoadError = ref(false)

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

    return {
      textRef,
      selfRef,
      fitTextTransform,
      hasLoadError,
      handleError,
      shouldStartLoading,
      loaded,
      mergedOnLoad,
    }
  },
  render() {
    let img: VNodeChild
    const placeholderNode = !this.loaded
    && !this.hasLoadError
    && (this.$props.renderPlaceholder
      ? this.$props.renderPlaceholder()
      : this.$slots.placeholder?.())

    if (this.hasLoadError) {
      img = this.$props.renderPlaceholder
        ? this.$props.renderPlaceholder()
        : resolveSlot(this.$slots.fallback, () => [
          h('img', {
            destyler: 'avatar-fallback',
            src: this.$props.fallbackSrc,
          }),
        ])
    }
    else {
      img = resolveWrappedSlot(this.$slots.default, (children) => {
        if (children) {
          const avatatText = h('span', {
            ref: 'textRef',
            destyler: 'avatar-text',
          }, children)
          return h(DestylerResizeObserver, {
            onResize: this.fitTextTransform,
          }, {
            default: () => avatatText,
          })
        }
        else if (this.$props.src) {
          return h('img', {
            destyler: 'avatar-img',
            ...this.$props.imgProps,
            loading:
            isImageSupportNativeLazy
            && !this.$props.intersectionObserverOptions
            && this.$props.lazy
              ? 'lazy'
              : 'eager',
            src:
            isImageSupportNativeLazy
              ? this.$props.src
              : this.shouldStartLoading || this.loaded
                ? this.$props.src
                : null,
            onLoad: this.mergedOnLoad,
            onError: this.handleError,
          })
        }
      })
    }
    return h('span', {
      ref: 'selfRef',
      destyler: 'avatar',
    }, [
      img,
      this.$props.lazy && placeholderNode,
    ])
  },
})

export {
  DestylerAvatar,
}
