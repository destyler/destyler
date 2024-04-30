import { defineComponent, h, ref } from 'vue'
import { useRafFn, useTimeout } from '@destyler/composition'
import { DestylerVisuallyhidden } from '@destyler/visually-hidden'

import { injectToastProviderContext } from './provider'

export const DestylerToastAnnounce = defineComponent({
  name: 'DestylerToastAnnounce',
  setup() {
    const providerContext = injectToastProviderContext()
    const isAnnounced = useTimeout(1000)
    const renderAnnounceText = ref(false)

    useRafFn(() => {
      renderAnnounceText.value = true
    })

    return {
      providerContext,
      isAnnounced,
      renderAnnounceText,
    }
  },
  render() {
    return [
      this.isAnnounced || this.renderAnnounceText
        ? h(DestylerVisuallyhidden, null, () => [
          h('template', {}, this.providerContext.label.value),
          this.$slots.default?.(),
        ])
        : null,
    ]
  },
})
