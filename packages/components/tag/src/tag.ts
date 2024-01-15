import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProp } from '@destyler/primitive'

const destylerTagProps = {
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

export const DestylerTag = defineComponent({
  name: 'DestylerTag',
  props: destylerTagProps,
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
      ? h(DestylerPrimitive, {
        as: 'div',
        role: 'tag',
        asChild: this.$props.asChild,
      }, [
        this.$slots.default?.(),
        this.$props.closable ? this.$slots.close?.({ handleClose: this.handleCloseClick }) : null,
      ])
      : null
  },
})
