import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { DestylerPopperArrow } from '@destyler/popper'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectRootContext } from './selectRoot'
import { injectSelectContentContext } from './selectContentImpl'

export const destylerSelectArrowProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  width: {
    type: Number as PropType<number>,
    required: false,
    default: 5,
  },
  height: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'svg',
  },
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
      ? h(DestylerPopperArrow, this.$props, this.$slots.default?.())
      : null
  },
})
