import { describe, expect, it } from 'vitest'
import { normalizeColor, parseColor } from '../index'
import { getColorAreaGradient } from '../src/area-gradient'

describe('color Parsing Tests', () => {
  it('parse RGB colors', () => {
    expect(parseColor('#ff0000')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 0,
        "g": 0,
        "r": 255,
      }
    `)

    expect(parseColor('#ff0000aa')).toMatchInlineSnapshot(`
      {
        "a": 0.6666666666666666,
        "b": 0,
        "g": 0,
        "r": 255,
      }
    `)

    expect(parseColor('rgb(255, 0, 0)')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 0,
        "g": 0,
        "r": 255,
      }
    `)

    expect(parseColor('rgba(255, 0, 0, 0.5)')).toMatchInlineSnapshot(`
      {
        "a": 0.5,
        "b": 0,
        "g": 0,
        "r": 255,
      }
    `)
  })

  it('parse HSL colors', () => {
    expect(parseColor('hsl(0, 100%, 50%)')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "h": 0,
        "l": 50,
        "s": 100,
      }
    `)

    expect(parseColor('hsla(120, 50%, 25%, 0.8)')).toMatchInlineSnapshot(`
      {
        "a": 0.8,
        "h": 120,
        "l": 25,
        "s": 50,
      }
    `)
  })

  it('parse HSB colors', () => {
    expect(parseColor('hsb(240, 100%, 100%)')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 100,
        "h": 240,
        "s": 100,
      }
    `)

    expect(parseColor('hsba(60, 75%, 90%, 0.9)')).toMatchInlineSnapshot(`
      {
        "a": 0.9,
        "b": 90,
        "h": 60,
        "s": 75,
      }
    `)
  })

  it('parse native color names', () => {
    expect(parseColor('red')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 0,
        "g": 0,
        "r": 255,
      }
    `)

    expect(parseColor('blue')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 255,
        "g": 0,
        "r": 0,
      }
    `)

    expect(parseColor('forestgreen')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 34,
        "g": 139,
        "r": 34,
      }
    `)
  })

  it('parse invalid colors should throw', () => {
    expect(() => parseColor('invalid')).toThrowError('Invalid color value: invalid')
    expect(() => parseColor('#gg0000')).toThrowError('Invalid color value: #gg0000')
  })
})

describe('color Conversion Tests', () => {
  it('rGB to other formats', () => {
    const red = parseColor('#ff0000')

    expect(red.toString('hex')).toBe('#FF0000')
    expect(red.toString('hexa')).toBe('#FF0000FF')
    expect(red.toString('rgb')).toBe('rgb(255, 0, 0)')
    expect(red.toString('rgba')).toBe('rgba(255, 0, 0, 1)')
    expect(red.toString('hsl')).toBe('hsl(0, 100%, 50%)')
    expect(red.toString('hsb')).toBe('hsb(0, 100%, 100%)')
  })

  it('hSL to other formats', () => {
    const blue = parseColor('hsl(240, 100%, 50%)')

    expect(blue.toString('hex')).toBe('#0000FF')
    expect(blue.toString('hsl')).toBe('hsl(240, 100%, 50%)')
    expect(blue.toString('hsla')).toBe('hsla(240, 100%, 50%, 1)')
    expect(blue.toString('rgb')).toBe('rgb(0, 0, 255)')
    expect(blue.toString('hsb')).toBe('hsb(240, 100%, 100%)')
  })

  it('hSB to other formats', () => {
    const green = parseColor('hsb(120, 100%, 100%)')

    expect(green.toString('hex')).toBe('#00FF00')
    expect(green.toString('hsb')).toBe('hsb(120, 100%, 100%)')
    expect(green.toString('hsba')).toBe('hsba(120, 100%, 100%, 1)')
    expect(green.toString('rgb')).toBe('rgb(0, 255, 0)')
    expect(green.toString('hsl')).toBe('hsl(120, 100%, 50%)')
  })

  it('format conversion consistency', () => {
    const originalColor = parseColor('#8B4513')
    const hslColor = originalColor.toFormat('hsla')
    const hsbColor = originalColor.toFormat('hsba')

    // Convert back to RGB and compare
    expect(hslColor.toFormat('rgba').toString('hex')).toBe(originalColor.toString('hex'))
    expect(hsbColor.toFormat('rgba').toString('hex')).toBe(originalColor.toString('hex'))
  })
})

describe('color Channel Operations', () => {
  it('decrement', () => {
    const color = parseColor('#361717').toFormat('hsla')

    expect(color).toMatchInlineSnapshot(`
      {
        "a": 1,
        "h": 0,
        "l": 15.1,
        "s": 40.26,
      }
    `)

    expect(color.decrementChannel('saturation', 1)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "h": 0,
        "l": 15.1,
        "s": 39,
      }
    `)

    expect(color.decrementChannel('lightness', 1)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "h": 0,
        "l": 14,
        "s": 40.26,
      }
    `)
  })

  it('increment color channels', () => {
    const color = parseColor('#ff0000')

    expect(color.incrementChannel('green', 50).toString('rgb')).toBe('rgb(255, 50, 0)')
    expect(color.incrementChannel('blue', 100).toString('rgb')).toBe('rgb(255, 0, 100)')

    const hslColor = color.toFormat('hsla')
    expect(hslColor.incrementChannel('saturation', 10).getChannelValue('saturation')).toBe(100)
    expect(hslColor.incrementChannel('lightness', 25).getChannelValue('lightness')).toBe(75)
  })

  it('channel value clamping', () => {
    const color = parseColor('#ffffff')

    // Test upper bounds
    expect(color.incrementChannel('red', 100).getChannelValue('red')).toBe(255)
    expect(color.incrementChannel('green', 100).getChannelValue('green')).toBe(255)

    // Test lower bounds
    const blackColor = parseColor('#000000')
    expect(blackColor.decrementChannel('red', 100).getChannelValue('red')).toBe(0)
    expect(blackColor.decrementChannel('blue', 100).getChannelValue('blue')).toBe(0)
  })

  it('channel ranges', () => {
    const rgbColor = parseColor('#ff0000')
    expect(rgbColor.getChannelRange('red')).toEqual({
      minValue: 0,
      maxValue: 255,
      step: 1,
      pageSize: 17,
    })

    const hslColor = rgbColor.toFormat('hsla')
    expect(hslColor.getChannelRange('hue')).toEqual({
      minValue: 0,
      maxValue: 360,
      step: 1,
      pageSize: 15,
    })
    expect(hslColor.getChannelRange('saturation')).toEqual({
      minValue: 0,
      maxValue: 100,
      step: 1,
      pageSize: 10,
    })
  })

  it('channel value percentages', () => {
    const color = parseColor('#80ff00') // 50% red, 100% green, 0% blue

    expect(color.getChannelValuePercent('red')).toBeCloseTo(0.502, 2)
    expect(color.getChannelValuePercent('green')).toBe(1)
    expect(color.getChannelValuePercent('blue')).toBe(0)

    expect(color.getChannelPercentValue('red', 0.75)).toBe(191)
    expect(color.getChannelPercentValue('green', 0.5)).toBe(128)
  })
})

describe('color Formatting and Localization', () => {
  it('format channel values', () => {
    const color = parseColor('#ff8040')

    expect(color.formatChannelValue('red', 'en-US')).toBe('255')
    expect(color.formatChannelValue('alpha', 'en-US')).toBe('100%')

    const hslColor = color.toFormat('hsla')
    // 修复：允许小数位数的度数格式
    expect(hslColor.formatChannelValue('hue', 'en-US')).toMatch(/^\d+(\.\d+)?°$/)
    expect(hslColor.formatChannelValue('saturation', 'en-US')).toMatch(/^\d+%$/)
  })

  it('jSON serialization', () => {
    const rgbColor = parseColor('#ff8040')
    expect(rgbColor.toJSON()).toEqual({ r: 255, g: 128, b: 64, a: 1 })

    const hslColor = rgbColor.toFormat('hsla')
    expect(hslColor.toJSON()).toEqual(
      expect.objectContaining({
        h: expect.any(Number),
        s: expect.any(Number),
        l: expect.any(Number),
        a: 1,
      }),
    )
  })
})

describe('color Equality and Cloning', () => {
  it('color equality', () => {
    const color1 = parseColor('#ff0000')
    const color2 = parseColor('rgb(255, 0, 0)')
    const color3 = parseColor('#ff0001')

    expect(color1.isEqual(color2)).toBe(true)
    expect(color1.isEqual(color3)).toBe(false)

    // 修复：转换为同一格式再比较
    const hslRed = parseColor('hsl(0, 100%, 50%)')
    const color1RGB = color1.toFormat('rgba')
    const hslRedRGB = hslRed.toFormat('rgba')
    expect(color1RGB.isEqual(hslRedRGB)).toBe(true)
  })

  it('color cloning', () => {
    const original = parseColor('#ff8040')
    const cloned = original.clone()

    expect(cloned.isEqual(original)).toBe(true)
    expect(cloned).not.toBe(original) // Different instances

    const modified = cloned.withChannelValue('red', 128)
    expect(modified.isEqual(original)).toBe(false)
  })
})

describe('color Axes and Gradient Generation', () => {
  it('color axes calculation', () => {
    const color = parseColor('#ff8040')
    const axes = color.getColorAxes({ xChannel: 'red', yChannel: 'green' })

    expect(axes).toEqual({
      xChannel: 'red',
      yChannel: 'green',
      zChannel: 'blue',
    })
  })

  it('gradient generation', () => {
    const color = parseColor('#ff8040')
    const gradient = getColorAreaGradient(color, {
      xChannel: 'red',
      yChannel: 'green',
    })

    expect(gradient).toHaveProperty('areaStyles')
    expect(gradient).toHaveProperty('areaGradientStyles')
    expect(gradient.areaStyles).toHaveProperty('backgroundImage')
  })
})

describe('hex Integer Conversion', () => {
  it('hexint', () => {
    expect(parseColor('hsl(0, 92%, 13%)')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "h": 0,
        "l": 13,
        "s": 92,
      }
    `)

    expect(parseColor('hsl(0, 76%, 31%)')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "h": 0,
        "l": 31,
        "s": 76,
      }
    `)
  })

  it('hex integer conversion', () => {
    expect(parseColor('#ff0000').toHexInt()).toBe(0xFF0000)
    expect(parseColor('#00ff00').toHexInt()).toBe(0x00FF00)
    expect(parseColor('#0000ff').toHexInt()).toBe(0x0000FF)
    expect(parseColor('#ffffff').toHexInt()).toBe(0xFFFFFF)
    expect(parseColor('#000000').toHexInt()).toBe(0x000000)
  })
})

describe('edge Cases and Error Handling', () => {
  it('alpha channel handling', () => {
    const transparentRed = parseColor('rgba(255, 0, 0, 0)')
    expect(transparentRed.getChannelValue('alpha')).toBe(0)
    expect(transparentRed.toString('hexa')).toBe('#FF000000')

    const semiTransparent = parseColor('rgba(255, 0, 0, 0.5)')
    expect(semiTransparent.getChannelValue('alpha')).toBe(0.5)
  })

  it('hue wrapping', () => {
    const hslColor = parseColor('hsl(0, 100%, 50%)')
    const wrappedHue = hslColor.withChannelValue('hue', 370)
    expect(wrappedHue.getChannelValue('hue')).toBe(360) // Should be clamped to max
  })

  it('normalizeColor function', () => {
    const colorString = '#ff0000'
    const colorObject = parseColor(colorString)

    expect(normalizeColor(colorString)).toEqual(colorObject)
    expect(normalizeColor(colorObject)).toBe(colorObject)
  })

  it('format validation', () => {
    const color = parseColor('#ff0000')

    expect(() => color.toFormat('invalid' as any)).toThrow()
  })
})

describe('comprehensive Color Space Tests', () => {
  it('common colors across formats', () => {
    const testColors = [
      { name: 'white', hex: '#ffffff', rgb: 'rgb(255, 255, 255)', hsl: 'hsl(0, 0%, 100%)' },
      { name: 'black', hex: '#000000', rgb: 'rgb(0, 0, 0)', hsl: 'hsl(0, 0%, 0%)' },
      { name: 'gray', hex: '#808080', rgb: 'rgb(128, 128, 128)', hsl: 'hsl(0, 0%, 50%)' },
      { name: 'red', hex: '#ff0000', rgb: 'rgb(255, 0, 0)', hsl: 'hsl(0, 100%, 50%)' },
      { name: 'green', hex: '#00ff00', rgb: 'rgb(0, 255, 0)', hsl: 'hsl(120, 100%, 50%)' },
      { name: 'blue', hex: '#0000ff', rgb: 'rgb(0, 0, 255)', hsl: 'hsl(240, 100%, 50%)' },
    ]

    testColors.forEach(({ hex, rgb, hsl }) => {
      const hexColor = parseColor(hex)
      const rgbColor = parseColor(rgb)
      const hslColor = parseColor(hsl)

      // 修复：转换为相同格式进行比较
      const hexAsRGB = hexColor.toFormat('rgba')
      const hslAsRGB = hslColor.toFormat('rgba')

      expect(hexAsRGB.isEqual(rgbColor)).toBe(true)
      expect(hexAsRGB.isEqual(hslAsRGB)).toBe(true)
      expect(rgbColor.isEqual(hslAsRGB)).toBe(true)
    })
  })
})
