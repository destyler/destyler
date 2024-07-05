import type { PropType } from 'vue'
import { Teleport, defineComponent, h } from 'vue'
import { useMounted } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const teleportPrimitiveProps = {
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
} as const

export type TeleportPrimitiveProps = ExtractPublicPropTypes<typeof teleportPrimitiveProps>

export const TeleportPrimitive = defineComponent({
  name: 'DestylerTeleportPrimitive',
  props: teleportPrimitiveProps,
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
