import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { provideSelectRootContext } from './root'
import type { SelectRootContext } from './root'

export const destylerSelectProviderProps = {
  context: {
    type: Object as PropType<SelectRootContext>,
  },
} as const

export type DestylerSelectProviderProps = ExtractPublicPropTypes<typeof destylerSelectProviderProps>

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
