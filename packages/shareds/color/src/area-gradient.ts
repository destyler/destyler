import type { Color } from './color'
import type { ColorChannel } from './types'
import {
  generateHSB_B,
  generateHSB_H,
  generateHSB_S,
  generateHSL_H,
  generateHSL_L,
  generateHSL_S,
  generateRGB_B,
  generateRGB_G,
  generateRGB_R,
} from './color-format-gradient'

interface GradientOptions {
  xChannel: ColorChannel
  yChannel: ColorChannel
  dir?: 'rtl' | 'ltr' | undefined
}

interface GradientStyles {
  areaStyles: Record<string, string>
  areaGradientStyles: Record<string, string>
}

export function getColorAreaGradient(color: Color, options: GradientOptions): GradientStyles {
  const { xChannel, yChannel, dir: dirProp = 'ltr' } = options

  const { zChannel } = color.getColorAxes({ xChannel, yChannel })
  const zValue = color.getChannelValue(zChannel)

  const { minValue: zMin, maxValue: zMax } = color.getChannelRange(zChannel)
  const orientation: [string, string] = ['top', dirProp === 'rtl' ? 'left' : 'right']

  let dir = false

  let background = { areaStyles: {}, areaGradientStyles: {} }

  const alphaValue = (zValue - zMin) / (zMax - zMin)
  const isHSL = color.getFormat() === 'hsla'

  switch (zChannel) {
    case 'red': {
      dir = xChannel === 'green'
      background = generateRGB_R(orientation, dir, zValue)
      break
    }

    case 'green': {
      dir = xChannel === 'red'
      background = generateRGB_G(orientation, dir, zValue)
      break
    }

    case 'blue': {
      dir = xChannel === 'red'
      background = generateRGB_B(orientation, dir, zValue)
      break
    }

    case 'hue': {
      dir = xChannel !== 'saturation'
      if (isHSL) {
        background = generateHSL_H(orientation, dir, zValue)
      }
      else {
        background = generateHSB_H(orientation, dir, zValue)
      }
      break
    }

    case 'saturation': {
      dir = xChannel === 'hue'
      if (isHSL) {
        background = generateHSL_S(orientation, dir, alphaValue)
      }
      else {
        background = generateHSB_S(orientation, dir, alphaValue)
      }
      break
    }

    case 'brightness': {
      dir = xChannel === 'hue'
      background = generateHSB_B(orientation, dir, alphaValue)
      break
    }

    case 'lightness': {
      dir = xChannel === 'hue'
      background = generateHSL_L(orientation, dir, zValue)
      break
    }
  }

  return background
}
