import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectPopoverRootContext } from './root'

export const popoverCloseProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type PopoverCloseProps = ExtractPublicPropTypes<typeof popoverCloseProps>

export const PopoverClose = defineComponent({
  name: 'DestylerPopoverClose',
  props: popoverCloseProps,
  setup() {
    const rootContext = injectPopoverRootContext()

    return {
      rootContext,
    }
  },
  render() {
    return h(Primitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      type: this.$props.as === 'button' ? 'button' : undefined,
      onClick: () => {
        this.rootContext.onOpenChange(false)
      },
    }, () => this.$slots.default?.())
  },
})
