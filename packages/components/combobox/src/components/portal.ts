import { type PropType, defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { DestylerTeleport } from '@destyler/teleport'

export const destylerComboboxPortalProps = {
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

export type DestylerComboboxPortalProps = ExtractPublicPropTypes<typeof destylerComboboxPortalProps>

export const DestylerComboboxPortal = defineComponent({
  name: 'DestylerComboboxPortal',
  props: destylerComboboxPortalProps,
  render() {
    return h(DestylerTeleport, this.$props, {
      default: () => this.$slots.default?.(),
    })
  },
})
