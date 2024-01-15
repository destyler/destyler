import type { PropType } from 'vue'
import { Teleport, defineComponent, h } from 'vue'
import { useMounted } from '@destyler/composition'

export const destylerTeleportProps = {
  to: {
    type: [String, Object] as PropType<string | HTMLElement>,
    required: false,
    default: 'body',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
}

export const DestylerTeleport = defineComponent({
  name: 'DestylerTeleport',
  props: destylerTeleportProps,
  setup() {
    const isMounted = useMounted()

    return {
      isMounted,
    }
  },
  render() {
    const useVShow = this.isMounted || this.$props.forceMount
    return useVShow
      ? h(Teleport, {
        to: this.to,
        disabled: this.disabled,
      }, {
        default: () => {
          return this.$slots.default?.()
        },
      })
      : null
  },
})
