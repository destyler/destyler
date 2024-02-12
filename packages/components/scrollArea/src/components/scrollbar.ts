import type { Component, PropType, Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, onUnmounted, toRefs, watch } from 'vue'
import { type ExtractPublicPropTypes, createContext } from '@destyler/shared'
import type { AsTag } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'

import { injectScrollAreaRootContext } from './root'
import { DestylerScrollAreaScrollbarHover } from './scrollbarHover'
import { DestylerScrollAreaScrollbarScroll } from './scrollbarScroll'
import { DestylerScrollAreaScrollbarAuto } from './scrollbarAuto'
import { DestylerScrollAreaScrollbarVisible } from './scrollbarVisible'

export const destylerScrollAreaScrollbarProps = {
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
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    required: false,
    default: 'vertical',
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerScrollAreaScrollbarProps = ExtractPublicPropTypes<typeof destylerScrollAreaScrollbarProps>

export interface ScrollAreaScollbarContext {
  as: Ref<AsTag | Component>
  orientation: Ref<'vertical' | 'horizontal'>
  forceMount?: Ref<boolean | undefined>
  isHorizontal: Ref<boolean>
  asChild: Ref<boolean>
}

export const [injectScrollAreaScrollbarContext, provideScrollAreaScrollbarContext] = createContext<ScrollAreaScollbarContext>('DestylerScrollAreaScrollbar')

export const DestylerScrollAreaScrollbar = defineComponent({
  name: 'DestylerScrollAreaScrollbar',
  inheritAttrs: false,
  props: destylerScrollAreaScrollbarProps,
  setup(props) {
    const { forwardRef } = useForwardExpose()
    const rootContext = injectScrollAreaRootContext()

    const isHorizontal = computed(() => props.orientation === 'horizontal')

    watch(
      isHorizontal,
      () => {
        if (isHorizontal.value)
          rootContext.onScrollbarXEnabledChange(true)
        else rootContext.onScrollbarYEnabledChange(true)
      },
      { immediate: true },
    )

    onUnmounted(() => {
      rootContext.onScrollbarXEnabledChange(false)
      rootContext.onScrollbarYEnabledChange(false)
    })

    const { orientation, forceMount, asChild, as } = toRefs(props)
    provideScrollAreaScrollbarContext({
      orientation,
      forceMount,
      isHorizontal,
      as,
      asChild,
    })

    return {
      forwardRef,
      rootContext,
    }
  },
  render() {
    if (this.rootContext.type.value === 'hover') {
      return h(DestylerScrollAreaScrollbarHover, mergeProps(this.$attrs, {
        ref: this.forwardRef,
        forceMount: this.$props.forceMount,
      }), {
        default: () => this.$slots.default?.(),
      })
    }
    else if (this.rootContext.type.value === 'scroll') {
      return h(DestylerScrollAreaScrollbarScroll, mergeProps(this.$attrs, {
        ref: this.forwardRef,
        forceMount: this.$props.forceMount,
      }), {
        default: () => this.$slots.default?.(),
      })
    }
    else if (this.rootContext.type.value === 'auto') {
      return h(DestylerScrollAreaScrollbarAuto, mergeProps(this.$attrs, {
        ref: this.forwardRef,
        forceMount: this.$props.forceMount,
      }), {
        default: () => this.$slots.default?.(),
      })
    }
    else if (this.rootContext.type.value === 'always') {
      return h(DestylerScrollAreaScrollbarVisible, mergeProps(this.$attrs, {
        'ref': this.forwardRef,
        'forceMount': this.$props.forceMount,
        'data-state': 'visible',
      }), {
        default: () => this.$slots.default?.(),
      })
    }
  },
})
