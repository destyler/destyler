import type { PropType, SlotsType, VNode } from 'vue'
import { Teleport, computed, defineComponent, h, ref, watchEffect } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useCollection, useForwardExpose, useResizeObserver } from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { injectNavigationContext } from './root'

export const navigationIndicatorProps = {
  ...primitiveProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type NavigationIndicatorProps = ExtractPublicPropTypes<typeof navigationIndicatorProps>

export const NavigationIndicator = defineComponent({
  name: 'DestylerNavigationIndicator',
  props: navigationIndicatorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const { forwardRef } = useForwardExpose()
    const { injectCollection } = useCollection('nav')
    const collectionItems = injectCollection()
    const menuContext = injectNavigationContext()

    const position = ref<{ size: number, offset: number }>()
    const isHorizontal = computed(() => menuContext.orientation === 'horizontal')
    const isVisible = computed(() => !!menuContext.modelValue.value)

    const activeTrigger = ref<HTMLElement>()

    function handlePositionChange() {
      if (activeTrigger.value) {
        position.value = {
          size: isHorizontal.value
            ? activeTrigger.value.offsetWidth
            : activeTrigger.value.offsetHeight,
          offset: isHorizontal.value
            ? activeTrigger.value.offsetLeft
            : activeTrigger.value.offsetTop,
        }
      }
    }

    watchEffect(() => {
      if (!menuContext.modelValue.value) {
        position.value = undefined
        return
      }
      const items = collectionItems.value
      activeTrigger.value = items.find(item =>
        item.id.includes(menuContext.modelValue.value),
      )
      handlePositionChange()
    })

    useResizeObserver(activeTrigger, handlePositionChange)
    useResizeObserver(menuContext.indicatorTrack, handlePositionChange)

    return {
      menuContext,
      isVisible,
      forwardRef,
      isHorizontal,
      position,
    }
  },
  render() {
    return this.menuContext.indicatorTrack.value
      ? h(Teleport, {
        to: this.menuContext.indicatorTrack.value,
      }, () => h(Presence, {
        present: this.$props.forceMount || this.isVisible,
      }, () => h(Primitive, {
        'ref': (el: any) => this.forwardRef(el),
        'aria-hidden': '',
        'data-state': this.isVisible ? 'visible' : 'hidden',
        'data-orientation': this.menuContext.orientation,
        'asChild': this.$props.asChild,
        'as': this.$props.as,
        'style': {
          position: 'absolute',
          ...(this.isHorizontal
            ? {
                left: 0,
                width: `${this.position?.size}px`,
                transform: `translateX(${this.position?.offset}px)`,
              }
            : {
                top: 0,
                height: `${this.position?.size}px`,
                transform: `translateY(${this.position?.offset}px)`,
              }),
        },

      }, () => this.$slots.default?.())))
      : null
  },
})
