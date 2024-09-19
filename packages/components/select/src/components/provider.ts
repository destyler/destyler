import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { provideSelectRootContext } from './root'
import type { SelectRootContext } from './root'

export const selectProviderProps = {
  context: {
    type: Object as PropType<SelectRootContext>,
    required: true,
  },
} as const

export type SelectProviderProps = ExtractPublicPropTypes<typeof selectProviderProps>

export const SelectProvider = defineComponent({
  name: 'DestylerSelectProvider',
  props: selectProviderProps,
  setup(props) {
    provideSelectRootContext(props.context)
  },
  render() {
    return this.$slots.default?.()
  },
})
