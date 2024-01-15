import { defineComponent, h, mergeProps, onBeforeMount, onUnmounted } from 'vue'
import { DestylerPopperAnchor, destylerPopperArrowProps } from '@destyler/popper'
import { injectPopoverRootContext } from './popoverRoot'

export const destylerPopoverAnchorProps = {
  ...destylerPopperArrowProps,
}

export const DestylerPopoverAnchor = defineComponent({
  name: 'DestylerPopoverAnchor',
  props: destylerPopoverAnchorProps,
  setup() {
    const rootContext = injectPopoverRootContext()

    onBeforeMount(() => {
      rootContext.hasCustomAnchor.value = true
    })
    onUnmounted(() => {
      rootContext.hasCustomAnchor.value = false
    })
  },
  render() {
    return h(DestylerPopperAnchor, mergeProps(this.$props, {
    }), this.$slots.default?.())
  },
})
