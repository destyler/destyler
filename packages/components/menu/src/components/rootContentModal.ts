import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, withModifiers } from 'vue'
import { useForwardExpose, useForwardPropsEmits, useHideOthers } from '@destyler/composition'

import { MenuContentImpl, menuContentImplEmits, menuContentImplProps } from './contentImpl'
import { injectMenuContext } from './root'

export const MenuRootContentModal = defineComponent({
  name: 'DestylerMenuRootContentModal',
  props: menuContentImplProps,
  emits: menuContentImplEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    const menuContext = injectMenuContext()

    const { forwardRef, currentElement } = useForwardExpose()
    useHideOthers(currentElement)

    return {
      forwarded,
      forwardRef,
      menuContext,
    }
  },
  render() {
    return h(MenuContentImpl, mergeProps(this.forwarded, {
      'ref': (el: any) => this.forwardRef(el),
      'trap-focus': this.menuContext.open.value,
      'disableOutsidePointerEvents': this.menuContext.open.value,
      'disable-outside-scroll': true,
      'onDismiss': () => {
        this.menuContext.onOpenChange(false)
      },
      'onFocusOutside': withModifiers((event: any) => {
        this.$emit('focusOutside', event)
      }, ['prevent']),
    }), () => this.$slots.default?.())
  },
})
