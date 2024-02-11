import { computed, defineComponent, h, onMounted } from 'vue'
import { useForwardExpose } from '@destyler/composition'

import { getThumbSize } from '../utils'
import { injectScrollAreaRootContext } from './root'
import { injectScrollAreaScrollbarVisibleContext } from './scrollbarVisible'
import { DestylerScrollAreaScrollbarImpl } from './scrollbarImpl'

export const DestylerScrollAreaScrollbarX = defineComponent({
  name: 'DestylerScrollAreaScrollbarX',
  setup() {
    const rootContext = injectScrollAreaRootContext()
    const scrollbarVisibleContext = injectScrollAreaScrollbarVisibleContext()

    const { forwardRef, currentElement: scrollbarElement } = useForwardExpose()

    onMounted(() => {
      if (scrollbarElement.value)
        rootContext.onScrollbarXChange(scrollbarElement.value)
    })
    const sizes = computed(() => scrollbarVisibleContext.sizes.value)
    return {
      forwardRef,
      rootContext,
      sizes,
      scrollbarVisibleContext,
    }
  },
  render() {
    return h(DestylerScrollAreaScrollbarImpl, {
      'ref': 'forwardRef',
      'isHorizontal': true,
      'data-orientation': 'horizontal',
      'style': {
        'top': 0,
        'right': this.rootContext.dir.value === 'rtl' ? 'var(--destyler_scroll_area_corner_width)' : 0,
        'left': this.rootContext.dir.value === 'ltr' ? 'var(--destyler_scroll_area_corner_width)' : 0,
        'bottom': 'var(--destyler_scroll_area_corner_height)',
        '--destyler_scroll_area_thumb_width': this.sizes ? `${getThumbSize(this.sizes)}px` : undefined,
      },
      'onOnDragScroll': (event: any) => {
        this.scrollbarVisibleContext.onDragScroll(event.x)
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
