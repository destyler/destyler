import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useId } from '@destyler/composition'

export const selectGroupProps = {
  ...primitiveProps,
} as const

export type SelectGroupProps = ExtractPublicPropTypes<typeof selectGroupProps>

export interface SelectGroupContext {
  id: string
}

export const [injectSelectGroupContext, provideSelectGroupContext] = createContext<SelectGroupContext>('DestylerSelectGroup')

export const SelectGroup = defineComponent({
  name: 'DestylerSelectGroup',
  props: selectGroupProps,

  setup() {
    const id = useId(undefined, 'destyler-select-group')
    provideSelectGroupContext({ id })

    return {
      id,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$props, {
      'role': 'group',
      'aria-labelledby': this.id,
    }), () => this.$slots.default?.())
  },
})
