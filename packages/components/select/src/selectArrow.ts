import { defineComponent, h } from 'vue'
import { DestylerPopperArrow, destylerPopperArrowProps } from '@destyler/popper'

import { injectSelectRootContext } from './selectRoot'
import { injectSelectContentContext } from './selectContentImpl'

export const destylerSelectArrowProps = {
  ...destylerPopperArrowProps,
}

export const DestylerSelectArrow = defineComponent({
  name: 'DestylerSelectArrow',
  props: destylerSelectArrowProps,
  setup() {
    const rootContext = injectSelectRootContext()
    const contentContext = injectSelectContentContext()
    return {
      rootContext,
      contentContext,
    }
  },
  render() {
    return this.rootContext.open.value && this.contentContext.position === 'popper'
      ? h(DestylerPopperArrow, this.$props, this.$slots.default?.())
      : null
  },
})
