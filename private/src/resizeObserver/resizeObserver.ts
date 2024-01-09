import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'
import ResizeObserver from './SingleObserver'

export const DestylerResizeObserver = defineComponent({
  props: {
    disabled: {
      type: Boolean,
    },
    onResize: {
      type: Function,
      default: () => {},
    },
  },
  setup(props, context) {
    if (!(context.slots as any).default) {
      console.error('Warning: `children` of ResizeObserver is empty. Nothing is in observe.')
      return null
    }

    if ((context.slots as any)?.default().length > 1) {
      console.error('Warning: Find more than one child node with `children` in ResizeObserver, Not supported temporarily.')
      return null
    }

    return () => (
      (context.slots as any)?.default() || []).map((node: VNode) => {
      return h(ResizeObserver, { ...props }, node)
    },
    )
  },
})
