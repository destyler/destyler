import type { ExtractPropTypes } from 'vue'

type RemoveReadonly<T> = { -readonly [key in keyof T]: T[key] }

export type ExtractPublicPropTypes<T> = Omit<Partial<RemoveReadonly<ExtractPropTypes<T>>>, | Extract<keyof T, `internal${string}`>>

export type ExtractInternalPropTypes<T> = Partial<ExtractPropTypes<T>>
