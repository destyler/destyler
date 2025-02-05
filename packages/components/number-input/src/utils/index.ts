import type { MachineContext } from '../types'
import { NumberParser } from '@internationalized/number'
import { ref } from '@zag-js/core'

export function createFormatter(locale: string, options: Intl.NumberFormatOptions = {}) {
  return ref(new Intl.NumberFormat(locale, options))
}

export function createParser(locale: string, options: Intl.NumberFormatOptions = {}) {
  return ref(new NumberParser(locale, options))
}

export function parseValue(ctx: MachineContext, value: string) {
  if (!ctx.formatOptions)
    return Number.parseFloat(value)
  return ctx.parser.parse(String(value))
}

export function formatValue(ctx: MachineContext, value: number): string {
  if (Number.isNaN(value))
    return ''
  if (!ctx.formatOptions)
    return value.toString()
  return ctx.formatter.format(value)
}
