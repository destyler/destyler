import { defineComponent, h, ref } from 'vue'
import { useRafFn, useTimeout } from '@destyler/composition'
import { Visuallyhidden } from '@destyler/visually-hidden'

import { injectToastProviderContext } from './provider'

export const ToastAnnounce = defineComponent({
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
        ? h(Visuallyhidden, null, () => [
          h('template', null, () => this.providerContext.label.value),
          this.$slots.default?.(),
        ])
        : null,
    ]
  },
})
