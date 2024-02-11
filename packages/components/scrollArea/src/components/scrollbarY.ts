import { computed, defineComponent, h, onMounted } from 'vue'
import { useForwardExpose } from '@destyler/composition'

import { getThumbSize } from '../utils'
import { injectScrollAreaRootContext } from './root'
import { injectScrollAreaScrollbarVisibleContext } from './scrollbarVisible'
import { DestylerScrollAreaScrollbarImpl } from './scrollbarImpl'

export const DestylerScrollAreaScrollbarY = defineComponent({
  name: 'DestylerScrollAreaScrollbarY',
  setup() {
    const rootContext = injectScrollAreaRootContext()
    const scrollbarVisibleContext = injectScrollAreaScrollbarVisibleContext()

    const { forwardRef, currentElement: scrollbarElement } = useForwardExpose()

    onMounted(() => {
      if (scrollbarElement.value)
        rootContext.onScrollbarYChange(scrollbarElement.value)
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
      'isHorizontal': false,
      'data-orientation': 'vertical',
      'style': {
        'top': 0,
        'right': this.rootContext.dir.value === 'ltr' ? 0 : undefined,
        'left': this.rootContext.dir.value === 'rtl' ? 0 : undefined,
        'bottom': 'var(--destyler_scroll_area_corner_height)',
        '--destyler_scroll_area_thumb_height': this.sizes ? `${getThumbSize(this.sizes)}px` : undefined,
      },
      'onOnDragScroll': (event: any) => {
        this.scrollbarVisibleContext.onDragScroll(event.y)
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
