import type { PropType, Ref } from 'vue'
import { defineComponent, h, mergeProps, nextTick, ref, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { TeleportPrimitive } from '@destyler/teleport'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext, refAutoReset } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { useWindowSize } from '@vueuse/core'

export const previewRootProps = {
  ...primitiveProps,
  duration: {
    type: Number as PropType<number>,
    required: false,
    default: 500,
  },
  maxWidth: {
    type: Number as PropType<number>,
    required: false,
    default: 1000,
  },
} as const

export type PreviewRootProps = ExtractPublicPropTypes<typeof previewRootProps>

export interface PreviewRootContext {
  isPreviewActive: Ref<boolean>
}

export const [injectPreviewRootContext, providePreviewRootContext]
  = createContext<PreviewRootContext>('PreviewRoot')

export const PreviewRoot = defineComponent({
  name: 'DestylerPreviewRoot',
  inheritAttrs: false,
  props: previewRootProps,
  setup(props) {
    const { forwardRef, currentElement } = useForwardExpose()

    const isPreviewActive = ref(false)
    const isTransitioning = refAutoReset(false, props.duration)
    const initialScrollPosition = ref(0)
    function handleScroll() {
      const diff = Math.abs(initialScrollPosition.value - window.scrollY)
      if (diff > 10)
        isPreviewActive.value = false
    }

    const computedStyle = ref<any>({
      position: 'absolute',
      zIndex: '9999',
    })

    const { width: windowWidth, height: windowHeight } = useWindowSize({
      includeScrollbar: false,
    })

    function applyStying() {
      if (!isPreviewActive.value || !currentElement.value)
        return

      const { top, left, width, height } = currentElement.value.getBoundingClientRect()

      const scaleX = Math.max(width, windowWidth.value) / width
      const scaleY = Math.max(height, windowHeight.value) / height
      const maxScaleX = props.maxWidth / width
      const scale = Math.min(Math.min(scaleX, maxScaleX), scaleY)

      const translateX = (-left + (windowWidth.value - width) / 2) / scale
      const translateY = (-top + (windowHeight.value - height) / 2) / scale
      const transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`

      computedStyle.value.top = `${top + window.scrollY}px`
      computedStyle.value.left = `${left}px`
      computedStyle.value.width = `${width}px`
      computedStyle.value.transform = transform
      computedStyle.value.cursor = 'zoom-out'
    }

    function clearStyling() {
      computedStyle.value.transform = 'scale(1)'
      computedStyle.value.cursor = 'zoom-in'
    }

    watch(isPreviewActive, (n) => {
      // add scroll event listener
      if (n) {
        nextTick(() => {
          applyStying()
          initialScrollPosition.value = window.scrollY
          document.addEventListener('scroll', handleScroll)
        })
      }
      else {
        clearStyling()
        initialScrollPosition.value = 0
        isTransitioning.value = true
        document.removeEventListener('scroll', handleScroll)
      }
    })

    providePreviewRootContext({
      isPreviewActive,
    })

    return {
      isPreviewActive,
      isTransitioning,
      computedStyle,
      forwardRef,
    }
  },
  render() {
    const useVShow = this.isPreviewActive || this.isTransitioning
    return [
      h(Primitive, mergeProps(this.$attrs, {
        ref: (el: any) => this.forwardRef(el),
        as: this.$props.as,
        asChild: this.$props.asChild,
        style: {
          opacity: useVShow ? '0' : '1',
          cursor: 'zoom-in',
        },
        onClick: () => {
          this.isPreviewActive = !this.isPreviewActive
        },
      }), {
        default: () => this.$slots.default?.(),
      }),
      [
        useVShow
          ? h(TeleportPrimitive, null, () => h(Primitive, mergeProps(this.$attrs, {
            as: this.$props.as,
            asChild: this.$props.asChild,
            role: 'preview-dialog',
            onClick: () => {
              this.isPreviewActive = !this.isPreviewActive
            },
            style: this.computedStyle,
          }), {
            default: () => this.$slots.default?.(),
          }))
          : null,
      ],
    ]
  },
})
