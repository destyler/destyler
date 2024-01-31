export type DataOrientation = 'vertical' | 'horizontal'
export type Direction = 'ltr' | 'rtl'
export type Type = 'single' | 'multiple'
export type ArrowKeyOptions = 'horizontal' | 'vertical' | 'both'

export interface Measurable {
  getBoundingClientRect(): DOMRect
}
