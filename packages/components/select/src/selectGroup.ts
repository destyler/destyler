import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes} from '@destyler/shared';
import { createContext } from '@destyler/shared'
import { useId } from '@destyler/composition'

export const destylerSelectGroupProps = {
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
} as const

export type DestylerSelectGroupProps = ExtractPublicPropTypes<typeof destylerSelectGroupProps>

export interface SelectGroupContext {
  id: string
}

export const [injectSelectGroupContext, provideSelectGroupContext] = createContext<SelectGroupContext>('DestylerSelectGroup')

export const DestylerSelectGroup = defineComponent({
  name: 'DestylerSelectGroup',
  props: destylerSelectGroupProps,
  setup() {
    const id = useId()
    provideSelectGroupContext({ id })

    return {
      id,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'role': 'group',
      'aria-labelledby': this.id,
    }), this.$slots.default?.())
  },
})
