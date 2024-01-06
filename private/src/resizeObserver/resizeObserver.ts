import type { PropType } from 'vue'
import {
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  renderSlot,
} from 'vue'
import { ResizeObserverDelegate } from './util'

export type ResizeObserverOnResize = (entry: ResizeObserverEntry) => void

const DestylerResizeObserver = defineComponent({
  name: 'DestylerResizeObserver',
  props: {
    onResize: {
      type: Function as PropType<ResizeObserverOnResize>,
    },
  },
  setup(props) {
    let registered = false

    const delegate = ref<any>(null)

    const proxy = getCurrentInstance()!.proxy!
    function handleResize(entry: ResizeObserverEntry): void {
      if (props.onResize !== undefined)
        props.onResize(entry)
    }
    onMounted(() => {
      delegate.value = new ResizeObserverDelegate()
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
  },
  render() {
    return renderSlot(this.$slots, 'default')
  },

})

export {
  DestylerResizeObserver,
}
