import { defineComponent, h } from 'vue'
import { Visuallyhidden } from '@destyler/visually-hidden'

import { injectToastProviderContext } from './provider'

export const toastFocusProxyEmits = {
  focusFromOutsideViewport: () => true,
}

export const ToastFocusProxy = defineComponent({
  name: 'DestylerToastFocusProxy',
  emits: toastFocusProxyEmits,
  setup() {
    const providerContext = injectToastProviderContext()
    return {
      providerContext,
    }
  },
  render() {
    return h(Visuallyhidden, {
      'aria-hidden': '',
      'tabindex': '0',
      'style': {
        position: 'fixed',
      },
      'onFocus': (event: any) => {
        const prevFocusedElement = event.relatedTarget as HTMLElement | null
        const isFocusFromOutsideViewport = !this.providerContext.viewport.value?.contains(prevFocusedElement)
        if (isFocusFromOutsideViewport)
          this.$emit('focusFromOutsideViewport')
      },
    }, () => this.$slots.default?.())
  },
})
