import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerQrCodeRootProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  value: {
    type: String as PropType<string>,
    required: true,
  },
  ErrorCorrectionLevel: {
    type: String as PropType<'L' | 'M' | 'Q' | 'H'>,
    required: false,
    default: 'M',
  },
} as const

export type DestylerQrCodeRootProps = ExtractPublicPropTypes<typeof destylerQrCodeRootProps>

export interface QrCodeRootContext {
  value: Ref<string>
  ErrorCorrectionLevel: Ref<'L' | 'M' | 'Q' | 'H'>
}

export const [injectQrCodeRootContext, provideQrCodeRootContext] = createContext<QrCodeRootContext>('DestylerQrCodeRootContext')

export const DestylerQrCodeRoot = defineComponent({
  name: 'DestylerQrCodeRoot',
  props: destylerQrCodeRootProps,
  setup(props) {
    useForwardExpose()

    const { value, ErrorCorrectionLevel } = toRefs(props)

    provideQrCodeRootContext({
      value,
      ErrorCorrectionLevel,
    })
  },
  render() {
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-label': 'QR Code',
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
