import type { MaybeFn, Nullable, SyntheticChangeEvent, SyntheticEvent } from '@destyler/types'

interface VirtualElement {
  getBoundingClientRect: () => DOMRect
  contextElement?: Element | undefined
}

export type MeasurableElement = Element | VirtualElement

export type Booleanish = boolean | 'true' | 'false'

export interface Point {
  x: number
  y: number
}

export interface EventKeyOptions {
  dir?: 'ltr' | 'rtl' | undefined
  orientation?: 'horizontal' | 'vertical' | undefined
}

export type NativeEvent<E>
  = SyntheticChangeEvent<any> extends E ? InputEvent : E extends SyntheticEvent<any, infer T> ? T : never

export type AnyPointerEvent = MouseEvent | TouchEvent | PointerEvent

export type MaybeElement = Nullable<HTMLElement>

export type MaybeElementOrFn = MaybeFn<MaybeElement>

export type HTMLElementWithValue = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
