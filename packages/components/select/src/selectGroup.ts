import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { createContext } from '@destyler/shared'
import { useId } from '@destyler/composition'

export const destylerSelectGroupProps = {
  ...destylerPrimitiveProps,
}

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
