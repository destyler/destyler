import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, nextTick, ref, watch } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose, useResizeObserver } from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { getOpenState } from '../utils'
import { injectNavigationContext } from './root'

export const navigationViewportProps = {
  ...primitiveProps,
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Vue animation libraries.
   */
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type NavigationViewPortprops = ExtractPublicPropTypes<typeof navigationViewportProps>

export const NavigationViewport = defineComponent({
  name: 'DestylerNavigationViewPort',
  inheritAttrs: false,
  props: navigationViewportProps,
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
    return h(Presence, {
      present: this.$props.forceMount || this.open,
    }, () => h(Primitive, mergeProps(this.$attrs, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': getOpenState(this.open),
      'data-orientation': this.menuContext.orientation,
      'style': {
        pointerEvents: !this.open && this.menuContext.isRootMenu ? 'none' : undefined,
        ['--destyler-navigation-menu-viewport-width' as any]: this.size ? `${this.size?.width}px` : undefined,
        ['--destyler-navigation-menu-viewport-height' as any]: this.size ? `${this.size?.height}px` : undefined,
      },
      'onPointerenter': () => {
        this.menuContext.onContentEnter(this.menuContext.modelValue.value)
      },
      'onPointerleave': () => {
        this.menuContext.onContentLeave()
      },
    }), () => this.$slots.default?.()))
  },
})
