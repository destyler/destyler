import { defineComponent, h, mergeProps, withModifiers } from 'vue'
import { useForwardExpose, useForwardPropsEmits, useHideOthers } from '@destyler/composition'

import { DestylerMenuContentImpl, destylerMenuContentImplProps } from './contentImpl'
import { injectMenuContext } from './root'

export const DestylerMenuRootContentModal = defineComponent({
  name: 'DestylerMenuRootContentModal',
  props: destylerMenuContentImplProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'entryFocus'],
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
    return h(DestylerMenuContentImpl, mergeProps(this.forwarded, {
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
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
