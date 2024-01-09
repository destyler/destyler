import type { VNode } from 'vue'
import { defineComponent, getCurrentInstance, onMounted, ref, watchPostEffect } from 'vue'
import { observe, unobserve } from './util'

export interface SizeInfoType {
  width: number
  height: number
  offsetWidth: number
  offsetHeight: number
}

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,

    },
    onResize: {
      type: Function,
      default: () => {},
    },
  },
  setup(props, context) {
    const elementRef = ref< HTMLElement | null>(null)
    const sizeRef = ref<SizeInfoType>({
      width: -1,
      height: -1,
      offsetWidth: -1,
      offsetHeight: -1,
    })

    onMounted(() => {
      const instance = getCurrentInstance()
      elementRef.value = instance!.vnode.el as HTMLElement
    })

    const onInternalResize = (target: Element) => {
      const { width, height } = target.getBoundingClientRect()
      const { offsetWidth, offsetHeight } = target as HTMLElement

      const fixedWidth = Math.floor(width)
      const fixedHeight = Math.floor(height)

      if (
        sizeRef.value.width !== fixedWidth
        || sizeRef.value.height !== fixedHeight
        || sizeRef.value.offsetWidth !== offsetWidth
        || sizeRef.value.offsetHeight !== offsetHeight
      ) {
        const size = { width: fixedWidth, height: fixedHeight, offsetWidth, offsetHeight }
        sizeRef.value = size

        if (props.onResize) {
          Promise.resolve().then(() => {
            props.onResize(size, target)
          })
        }
      }
    }

    watchPostEffect((cleanEffect) => {
      const curElement = elementRef.value

      if (curElement && !props.disabled)
        observe(curElement, onInternalResize)

      if (curElement) {
        cleanEffect(() => {
          unobserve(curElement, onInternalResize)
        })
      }
    })

    const handleElementVnode = (arrVNode: VNode[]) => {
      return arrVNode[0]
    }

    return () => handleElementVnode((context.slots as any)?.default() || [])
  },
})
