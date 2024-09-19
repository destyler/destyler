import type { PropType, Ref } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const qrCodeRootProps = {
  ...primitiveProps,
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

export type QrCodeRootProps = ExtractPublicPropTypes<typeof qrCodeRootProps>

export interface QrCodeRootContext {
  value: Ref<string>
  ErrorCorrectionLevel: Ref<'L' | 'M' | 'Q' | 'H'>
}

export const [injectQrCodeRootContext, provideQrCodeRootContext] = createContext<QrCodeRootContext>('DestylerQrCodeRootContext')

export const QrCodeRoot = defineComponent({
  name: 'DestylerQrCodeRoot',
  props: qrCodeRootProps,

  setup(props) {
    useForwardExpose()

    const { value, ErrorCorrectionLevel } = toRefs(props)

    provideQrCodeRootContext({
      value,
      ErrorCorrectionLevel,
    })
  },
  render() {
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-label': 'QR Code',
    }, () => this.$slots.default?.())
  },
})
