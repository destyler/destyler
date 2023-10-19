import type { PropType } from 'vue'
import {
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  renderSlot,
} from 'vue'
import delegate from './util'

export type ResizeObserverOnResize = (entry: ResizeObserverEntry) => void

export default defineComponent({
  name: 'DestylerResizeObserver',
  props: {
    onResize: Function as PropType<ResizeObserverOnResize>,
  },
  setup(props, { slots }) {
    let registered = false

    const proxy = getCurrentInstance()!.proxy!
    function handleResize(entry: ResizeObserverEntry): void {
      const { onResize } = props
      if (onResize !== undefined)
        onResize(entry)
    }
    onMounted(() => {
      const el = proxy.$el as Element | undefined
      if (el === undefined) {
        console.error('DestylerResizeObserver', '$el does not exist.')
        return
      }
      if (el.nextElementSibling !== el.nextSibling) {
        if (el.nodeType === 3 && el.nodeValue !== '') {
          console.error(
            'DestylerResizeObserver',
            '$el can not be observed (it may be a text node).',
          )
          return
        }
      }
      if (el.nextElementSibling !== null) {
        delegate.registerHandler(el.nextElementSibling, handleResize)
        registered = true
      }
    })

    onBeforeUnmount(() => {
      if (registered)
        delegate.unregisterHandler(proxy.$el.nextElementSibling)
    })

    return () => renderSlot(slots, 'default')
  },
})
