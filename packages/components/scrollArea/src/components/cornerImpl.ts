import type { SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, ref, watch } from 'vue'
import { useResizeObserver } from '@destyler/composition'

import { Primitive } from '@destyler/primitive'
import { injectScrollAreaRootContext } from './root'

export const ScrollAreaCornerImpl = defineComponent({
  name: 'DestylerScrollAreaCornerImpl',
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContext = injectScrollAreaRootContext()

    const width = ref(0)
    const height = ref(0)

    const hasSize = computed(() => !!width.value && !!height.value)

    function setCornerHeight() {
      const offsetHeight = rootContext.scrollbarX.value?.offsetHeight || 0
      rootContext.onCornerHeightChange(offsetHeight)
      height.value = offsetHeight
    }
    function setCornerWidth() {
      const offsetWidth = rootContext.scrollbarY.value?.offsetWidth || 0
      rootContext.onCornerWidthChange(offsetWidth)
      width.value = offsetWidth
    }

    useResizeObserver(rootContext.scrollbarX.value, setCornerHeight)
    useResizeObserver(rootContext.scrollbarY.value, setCornerWidth)

    watch(() => rootContext.scrollbarX.value, setCornerHeight)
    watch(() => rootContext.scrollbarY.value, setCornerWidth)

    return {
      rootContext,
      width,
      height,
      hasSize,
    }
  },
  render() {
    return this.hasSize
      ? h(
        Primitive,
        {
          ...this.$parent?.$props,
          style: {
            width: `${this.width}px`,
            height: `${this.height}px`,
            position: 'absolute',
            right: this.rootContext.dir.value === 'ltr' ? 0 : undefined,
            left: this.rootContext.dir.value === 'rtl' ? 0 : undefined,
            bottom: 0,
          },
        },
        {
          default: () => this.$slots.default?.(),
        },
      )
      : null
  },
})
