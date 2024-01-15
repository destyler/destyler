import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, ref } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'

const destylerAlertProps = {
  ...destylerPrimitiveProp,
  closable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  onClose: {
    type: Function as PropType<() => boolean | Promise<boolean> | any>,
  },
}

const DestylerAlert = defineComponent({
  name: 'DestylerAlert',
  inheritAttrs: false,
  props: destylerAlertProps,
  setup(props) {
    const visibleRef = ref<boolean>(true)

    const handleCloseClick = (): void => {
      void Promise.resolve(props.onClose?.()).then((result) => {
        if (result === false)
          return
        visibleRef.value = false
      })
    }
    return {
      visible: visibleRef,
      handleCloseClick,
    }
  },
  render() {
    const useVShow = this.visible
    return useVShow
      ? h(DestylerPrimitive, mergeProps(this.$attrs, {
        as: 'div',
        role: 'alert',
        asChild: this.$props.asChild,
      }), [
        this.$props.closable ? this.$slots.close?.({ handleClose: this.handleCloseClick }) : null,
        this.$slots.default?.(),
      ])
      : null
  },
})

export {
  DestylerAlert,
}
