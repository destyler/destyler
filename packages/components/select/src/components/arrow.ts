import { defineComponent, h } from 'vue'
import { DestylerPopperArrow, destylerPopperArrowProps } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectRootContext } from './root'
import { injectSelectContentContext } from './contentImpl'

export const destylerSelectArrowProps = {
  ...destylerPopperArrowProps,
} as const

export type DestylerSelectArrowProps = ExtractPublicPropTypes<typeof destylerSelectArrowProps>

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
      ? h(DestylerPopperArrow, this.$props, () => this.$slots.default?.())
      : null
  },
})
