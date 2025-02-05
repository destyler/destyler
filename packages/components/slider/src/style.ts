import type { Style } from '@zag-js/types'
import type { MachineContext as Ctx, SharedContext } from './types'
import { getValuePercent, getValueTransformer } from '@zag-js/numeric-range'

function getBounds<T>(value: T[]): [T, T] {
  const firstValue = value[0]
  const lastThumb = value[value.length - 1]
  return [firstValue, lastThumb]
}

export function getRangeOffsets(ctx: Ctx) {
  const [firstPercent, lastPercent] = getBounds(ctx.valuePercent)

  if (ctx.valuePercent.length === 1) {
    if (ctx.origin === 'center') {
      const isNegative = ctx.valuePercent[0] < 50
      const start = isNegative ? `${ctx.valuePercent[0]}%` : '50%'
      const end = isNegative ? '50%' : `${100 - ctx.valuePercent[0]}%`

      return { start, end }
    }

    return { start: '0%', end: `${100 - lastPercent}%` }
  }

  return { start: `${firstPercent}%`, end: `${100 - lastPercent}%` }
}

function getRangeStyle(ctx: Pick<SharedContext, 'isVertical' | 'isRtl'>): Style {
  if (ctx.isVertical) {
    return {
      position: 'absolute',
      bottom: 'var(--slider-range-start)',
      top: 'var(--slider-range-end)',
    }
  }

  return {
    position: 'absolute',
    [ctx.isRtl ? 'right' : 'left']: 'var(--slider-range-start)',
    [ctx.isRtl ? 'left' : 'right']: 'var(--slider-range-end)',
  }
}

function getVerticalThumbOffset(ctx: SharedContext) {
  const { height = 0 } = ctx.thumbSize ?? {}
  const getValue = getValueTransformer([ctx.min, ctx.max], [-height / 2, height / 2])
  return Number.parseFloat(getValue(ctx.value).toFixed(2))
}

function getHorizontalThumbOffset(ctx: SharedContext) {
  const { width = 0 } = ctx.thumbSize ?? {}

  if (ctx.isRtl) {
    const getValue = getValueTransformer([ctx.max, ctx.min], [-width / 2, width / 2])
    return -1 * Number.parseFloat(getValue(ctx.value).toFixed(2))
  }

  const getValue = getValueTransformer([ctx.min, ctx.max], [-width / 2, width / 2])
  return Number.parseFloat(getValue(ctx.value).toFixed(2))
}

function getOffset(ctx: SharedContext, percent: number) {
  if (ctx.thumbAlignment === 'center')
    return `${percent}%`
  const offset = ctx.isVertical ? getVerticalThumbOffset(ctx) : getHorizontalThumbOffset(ctx)
  return `calc(${percent}% - ${offset}px)`
}

function getThumbOffset(ctx: SharedContext) {
  const percent = getValuePercent(ctx.value, ctx.min, ctx.max) * 100
  return getOffset(ctx, percent)
}

function getVisibility(ctx: Ctx) {
  let visibility: 'visible' | 'hidden' = 'visible'
  if (ctx.thumbAlignment === 'contain' && !ctx.hasMeasuredThumbSize) {
    visibility = 'hidden'
  }
  return visibility
}

function getThumbStyle(ctx: Ctx, index: number): Style {
  const placementProp = ctx.isVertical ? 'bottom' : 'insetInlineStart'
  return {
    visibility: getVisibility(ctx),
    position: 'absolute',
    transform: 'var(--slider-thumb-transform)',
    [placementProp]: `var(--slider-thumb-offset-${index})`,
  }
}

function getControlStyle(): Style {
  return {
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    position: 'relative',
  }
}

function getRootStyle(ctx: Ctx): Style {
  const range = getRangeOffsets(ctx)

  const offsetStyles = ctx.value.reduce<Style>((styles, value, index) => {
    const offset = getThumbOffset({ ...ctx, value })
    return { ...styles, [`--slider-thumb-offset-${index}`]: offset }
  }, {})

  return {
    ...offsetStyles,
    '--slider-thumb-transform': ctx.isVertical ? 'translateY(50%)' : ctx.isRtl ? 'translateX(50%)' : 'translateX(-50%)',
    '--slider-range-start': range.start,
    '--slider-range-end': range.end,
  }
}

function getMarkerStyle(
  ctx: Pick<SharedContext, 'isHorizontal' | 'isRtl' | 'thumbAlignment' | 'hasMeasuredThumbSize'>,
  value: number,
): Style {
  return {
    // @ts-expect-error error
    'visibility': getVisibility(ctx),
    'position': 'absolute',
    'pointerEvents': 'none',
    // @ts-expect-error error
    [ctx.isHorizontal ? 'insetInlineStart' : 'bottom']: getThumbOffset({ ...ctx, value }),
    'translate': 'var(--tx) var(--ty)',
    '--tx': ctx.isHorizontal ? (ctx.isRtl ? '50%' : '-50%') : '0%',
    '--ty': !ctx.isHorizontal ? '50%' : '0%',
  }
}

function getMarkerGroupStyle(): Style {
  return {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    pointerEvents: 'none',
    position: 'relative',
  }
}

export const styleGetterFns = {
  getRootStyle,
  getControlStyle,
  getThumbStyle,
  getRangeStyle,
  getMarkerStyle,
  getMarkerGroupStyle,
}
