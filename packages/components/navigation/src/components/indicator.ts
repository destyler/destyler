import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, watchEffect } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useCollection, useForwardExpose, useResizeObserver } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import { TeleportPrimitive } from '@destyler/teleport'

import { injectNavigationContext } from './root'

export const navigationIndicatorProps = {
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

export type NavigationIndicatorProps = ExtractPublicPropTypes<typeof navigationIndicatorProps>

export const NavigationIndicator = defineComponent({
  name: 'DestylerNavigationIndicator',
  inheritAttrs: false,
  props: navigationIndicatorProps,
  setup() {
    const { forwardRef } = useForwardExpose()
    const { injectCollection } = useCollection('nav')
    const collectionItems = injectCollection()
    const navigationContext = injectNavigationContext()

    const position = ref<{ size: number, offset: number }>()
    const isHorizontal = computed(() => navigationContext.orientation === 'horizontal')
    const isVisible = computed(() => !!navigationContext.modelValue.value)

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
      if (!navigationContext.modelValue.value) {
        position.value = undefined
        return
      }
      const items = collectionItems.value
      activeTrigger.value = items.find(item =>
        item.id.includes(navigationContext.modelValue.value),
      )
      handlePositionChange()
    })

    useResizeObserver(activeTrigger, handlePositionChange)
    useResizeObserver(navigationContext.indicatorTrack, handlePositionChange)

    return {
      navigationContext,
      isVisible,
      forwardRef,
      isHorizontal,
      position,
    }
  },
  render() {
    return this.navigationContext.indicatorTrack.value
      ? h(TeleportPrimitive, {
        to: this.navigationContext.indicatorTrack.value,
      }, () => h(Presence, {
        present: this.$props.forceMount || this.isVisible,
      }, () => h(Primitive, mergeProps(this.$attrs, {
        'ref': (el: any) => this.forwardRef(el),
        'aria-hidden': '',
        'data-state': this.isVisible ? 'visible' : 'hidden',
        'data-orientation': this.navigationContext.orientation,
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
      }), () => this.$slots.default?.())))
      : null
  },
})
