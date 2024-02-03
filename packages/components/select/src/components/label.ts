import type { Component, PropType } from 'vue'
import { defineComponent, h, withDirectives } from 'vue'
import { BindOnceDirective } from '@destyler/directives'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectSelectGroupContext } from './group'

export const destylerSelectLabelProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  for: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerSelectLabelProps = ExtractPublicPropTypes<typeof destylerSelectLabelProps>

export const DestylerSelectLabel = defineComponent({
  name: 'DestylerSelectLabel',
  props: destylerSelectLabelProps,
  setup() {
    const groupContext = injectSelectGroupContext({ id: '' })

    return {
      groupContext,
    }
  },
  render() {
    return withDirectives(h(DestylerPrimitive, this.$props, {
      default: () => this.$slots.default?.(),
    }), [
      [BindOnceDirective, { id: this.groupContext.id }],
    ])
  },
})
