import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, nextTick, ref, watch } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import { useForwardExpose, useResizeObserver } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { getOpenState } from '../utils'
import { injectNavigationContext } from './root'

export const destylerNavigationViewportProps = {
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
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerNavigationViewPortprops = ExtractPublicPropTypes<typeof destylerNavigationViewportProps>

export const DestylerNavigationViewport = defineComponent({
  name: 'DestylerNavigationViewPort',
  inheritAttrs: false,
  props: destylerNavigationViewportProps,
  setup() {
    const { forwardRef, currentElement } = useForwardExpose()

    const menuContext = injectNavigationContext()

    const size = ref<{ width: number, height: number }>()

    const open = computed(() => !!menuContext.modelValue.value)
    const activeContentValue = computed(() => menuContext.modelValue.value)

    watch(currentElement, () => {
      if (currentElement.value)
        menuContext.onViewportChange(currentElement.value)
    })

    const content = ref<HTMLElement>()

    watch([activeContentValue, open], async () => {
      await nextTick()
      if (!currentElement.value)
        return

      const el = (currentElement.value as HTMLElement).querySelector('[data-state=open]')?.children?.[0] as HTMLElement | undefined
      content.value = el
    }, { immediate: true })

    useResizeObserver(content, () => {
      if (content.value) {
        size.value = {
          width: content.value.offsetWidth,
          height: content.value.offsetHeight,
        }
      }
    })

    return {
      forwardRef,
      menuContext,
      open,
      size,
    }
  },
  render() {
    return h(DestylerPresence, {
      present: this.$props.forceMount || this.open,
    }, {
      default: () => {
        return h(DestylerPrimitive, mergeProps(this.$attrs, {
          'ref': (el: any) => this.forwardRef(el),
          'as': this.$props.as,
          'asChild': this.$props.asChild,
          'data-state': getOpenState(this.open),
          'data-orientation': this.menuContext.orientation,
          'style': {
            pointerEvents: !this.open && this.menuContext.isRootMenu ? 'none' : undefined,
            ['--destyler_navigation_menu_viewport_width' as any]: this.size ? `${this.size?.width}px` : undefined,
            ['--destyler_navigation_menu_viewport_height' as any]: this.size ? `${this.size?.height}px` : undefined,
          },
          'onPointerenter': () => {
            this.menuContext.onContentEnter(this.menuContext.modelValue.value)
          },
          'onPointerleave': () => {
            this.menuContext.onContentLeave()
          },
        }), {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
