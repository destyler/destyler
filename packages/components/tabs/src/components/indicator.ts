import { defineComponent, h, mergeProps, nextTick, ref, watch } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useResizeObserver } from '@destyler/composition'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'

import { injectTabsRootContext } from './root'

export const destylerTabsIndicatorProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
} as const

export type DestylerTabsIndicatorProps = ExtractPublicPropTypes<typeof destylerTabsIndicatorProps>

export const DestylerTabsIndicator = defineComponent({
  name: 'DestylerTabsIndicator',
  props: destylerTabsIndicatorProps,
  setup() {
    const context = injectTabsRootContext()
    useForwardExpose()

    interface IndicatorStyle {
      size: number | null
      position: number | null
    }
    const indicatorStyle = ref<IndicatorStyle>({
      size: null,
      position: null,
    })

    watch(() => context.modelValue.value, async () => {
      await nextTick()
      updateIndicatorStyle()
    }, { immediate: true })

    useResizeObserver(context.tabsList, updateIndicatorStyle)

    function updateIndicatorStyle() {
      const activeTab = context.tabsList.value?.querySelector<HTMLButtonElement>('[role="tab"][data-state="active"]')

      if (!activeTab)
        return

      if (context.orientation.value === 'horizontal') {
        indicatorStyle.value = {
          size: activeTab.offsetWidth,
          position: activeTab.offsetLeft,
        }
      }
      else {
        indicatorStyle.value = {
          size: activeTab.offsetHeight,
          position: activeTab.offsetTop,
        }
      }
    }

    return {
      indicatorStyle,
    }
  },
  render() {
    return [
      typeof this.indicatorStyle.size === 'number'
        ? h(DestylerPrimitive, mergeProps(this.$props, {
          style: {
            '--destyler_tabs_indicator_size': `${this.indicatorStyle.size}px`,
            '--destyler_tabs_indicator_position': `${this.indicatorStyle.position}px`,
          },
        }), () => this.$slots.default?.())
        : null,
    ]
  },
})
