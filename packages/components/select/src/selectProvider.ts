import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { provideSelectRootContext } from './selectRoot'
import type { SelectRootContext } from './selectRoot'

export const destylerSelectProviderProps = {
  context: {
    type: Object as PropType<SelectRootContext>,
  },
}

export const DestylerSelectProvider = defineComponent({
  name: 'DestylerSelectProvider',
  props: destylerSelectProviderProps,
  setup(props) {
    provideSelectRootContext(props.context!)
  },
  render() {
    return this.$slots.default?.()
  },
})
