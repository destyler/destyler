import type { MachineContext } from './types'

const REGEX = {
  numeric: /^\d+$/,
  alphabetic: /^[A-Z]+$/i,
  alphanumeric: /^[a-z0-9]+$/i,
}

export function isValidType(ctx: MachineContext, value: string) {
  if (!ctx.type)
    return true
  return !!REGEX[ctx.type]?.test(value)
}

export function isValidValue(ctx: MachineContext, value: string) {
  if (!ctx.pattern)
    return isValidType(ctx, value)
  const regex = new RegExp(ctx.pattern, 'g')
  return regex.test(value)
}
