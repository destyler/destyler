import { defineComponent, h } from 'vue'
import { DestylerVisuallyhidden } from '@destyler/visually-hidden'

import { injectToastProviderContext } from './provider'

export const DestylerToastFocusProxy = defineComponent({
  name: 'DestylerToastFocusProxy',
  emits: ['focusFromOutsideViewport'],
  setup() {
    const providerContext = injectToastProviderContext()
    return {
      providerContext,
    }
  },
  render() {
    return h(DestylerVisuallyhidden, {
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
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
