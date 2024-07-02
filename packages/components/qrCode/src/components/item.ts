import type { PropType } from 'vue'
import { computed, defineComponent, h, onMounted, ref, watchEffect } from 'vue'
import { Primitive } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import qrcodegen from '../qrcodegen'
import { injectQrCodeRootContext } from './root'

export const qrCodeItemProps = {
  size: {
    type: Number as PropType<number>,
    default: 100,
  },
  foregroundColor: {
    type: String as PropType<string>,
    default: '#000',
  },
  backgroundColor: {
    type: String as PropType<string>,
    default: '#FFF',
  },
} as const

export type QrCodeItemProps = ExtractPublicPropTypes<typeof qrCodeItemProps>

const ERROR_CORRECTION_LEVEL: Record<string, qrcodegen.QrCode.Ecc> = {
  L: qrcodegen.QrCode.Ecc.LOW,
  M: qrcodegen.QrCode.Ecc.MEDIUM,
  Q: qrcodegen.QrCode.Ecc.QUARTILE,
  H: qrcodegen.QrCode.Ecc.HIGH,
}

export const QrCodeItem = defineComponent({
  name: 'DestylerQrCodeItem',
  props: qrCodeItemProps,
  setup(props) {
    // For retina display
    const UPSCALE_RATIO = 2

    const rootContext = injectQrCodeRootContext()

    const { forwardRef, currentElement } = useForwardExpose()

    const qr = computed(() => {
      const errorCorrectionLevel
        = ERROR_CORRECTION_LEVEL[rootContext.ErrorCorrectionLevel.value]
      return qrcodegen.QrCode.encodeText(
        rootContext.value.value ?? '-',
        errorCorrectionLevel,
      )
    })

    onMounted(() => {
      const imageLoadedTrigger = ref(0)
      watchEffect(() => {
        void imageLoadedTrigger.value
        drawCanvas(
          qr.value,
          props.size,
          props.foregroundColor,
          props.backgroundColor,
        )
      })
    })

    function drawCanvas(
      qr: qrcodegen.QrCode,
      size: number,
      foregroundColor: string,
      backgroundColor: string,
    ): void {
      const canvas = currentElement.value as HTMLCanvasElement
      if (!canvas)
        return
      const canvasWidth = size * UPSCALE_RATIO
      const width = qr.size
      const scale = canvasWidth / width
      canvas.width = canvasWidth
      canvas.height = canvasWidth
      const ctx = canvas.getContext('2d')
      if (!ctx)
        return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let y = 0; y < qr.size; y++) {
        for (let x = 0; x < qr.size; x++) {
          ctx.fillStyle = qr.getModule(x, y) ? foregroundColor : backgroundColor
          const startX = Math.floor(x * scale)
          const endX = Math.ceil((x + 1) * scale)
          const startY = Math.floor(y * scale)
          const endY = Math.ceil((y + 1) * scale)
          ctx.fillRect(startX, startY, endX - startX, endY - startY)
        }
      }
    }

    return {
      forwardRef,
    }
  },
  render() {
    return h(Primitive, {
      as: 'canvas',
      asChild: false,
      ref: (el: any) => this.forwardRef(el),
    })
  },
})
