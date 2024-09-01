import type { Component, PropType, Ref } from 'vue'
import {
  computed,
  defineComponent,
  h,
  mergeProps,
  onUnmounted,
  toRefs,
  watch,
} from 'vue'
import { type ExtractPublicPropTypes, createContext } from '@destyler/shared'
import { type AsTag, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'

import { injectScrollAreaRootContext } from './root'
import { ScrollAreaScrollbarHover } from './scrollbarHover'
import { ScrollAreaScrollbarScroll } from './scrollbarScroll'
import { ScrollAreaScrollbarAuto } from './scrollbarAuto'
import { ScrollAreaScrollbarVisible } from './scrollbarVisible'

export const scrollAreaScrollbarProps = {
  ...primitiveProps,
  /**
   * The orientation of the scrollbar
   *
   * @default vertical
   */
  orientation: {
    type: String as PropType<'vertical' | 'horizontal'>,
    required: false,
    default: 'vertical',
  },
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Vue animation libraries.
   */
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ScrollAreaScrollbarProps = ExtractPublicPropTypes<
  typeof scrollAreaScrollbarProps
>

export interface ScrollAreaScollbarContext {
  as: Ref<AsTag | Component>
  orientation: Ref<'vertical' | 'horizontal'>
  forceMount?: Ref<boolean | undefined>
  isHorizontal: Ref<boolean>
  asChild: Ref<boolean>
}

export const [
  injectScrollAreaScrollbarContext,
  provideScrollAreaScrollbarContext,
] = createContext<ScrollAreaScollbarContext>('DestylerScrollAreaScrollbar')

export const ScrollAreaScrollbar = defineComponent({
  name: 'DestylerScrollAreaScrollbar',
  inheritAttrs: false,
  props: scrollAreaScrollbarProps,
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
      return h(
        ScrollAreaScrollbarHover,
        mergeProps(this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
          forceMount: this.$props.forceMount,
        }),
        {
          default: () => this.$slots.default?.(),
        },
      )
    }
    else if (this.rootContext.type.value === 'scroll') {
      return h(
        ScrollAreaScrollbarScroll,
        mergeProps(this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
          forceMount: this.$props.forceMount,
        }),
        {
          default: () => this.$slots.default?.(),
        },
      )
    }
    else if (this.rootContext.type.value === 'auto') {
      return h(
        ScrollAreaScrollbarAuto,
        mergeProps(this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
          forceMount: this.$props.forceMount,
        }),
        {
          default: () => this.$slots.default?.(),
        },
      )
    }
    else if (this.rootContext.type.value === 'always') {
      return h(
        ScrollAreaScrollbarVisible,
        mergeProps(this.$attrs, {
          'ref': (el: any) => this.forwardRef(el),
          'forceMount': this.$props.forceMount,
          'data-state': 'visible',
        }),
        {
          default: () => this.$slots.default?.(),
        },
      )
    }
  },
})
