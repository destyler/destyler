export type DataOrientation = 'vertical' | 'horizontal'
export type Direction = 'ltr' | 'rtl'
export type Type = 'single' | 'multiple'
export type SingleOrMultipleType = 'single' | 'multiple'
export type ArrowKeyOptions = 'horizontal' | 'vertical' | 'both'
export type Orientation = 'horizontal' | 'vertical'
export type ScrollType = 'auto' | 'always' | 'scroll' | 'hover'

export interface Measurable {
  getBoundingClientRect: () => DOMRect
}

export interface SingleOrMultipleProps<ValidValue = string | string[], ExplicitType = SingleOrMultipleType> {
  /**
   * Determines whether a "single" or "multiple" items can be pressed at a time.
   *
   * This prop will be ignored if any of `v-model` or `defaultValue` is an defined, as the type will be inferred from the value.
   */
  type?: ValidValue extends string
    ? 'single'
    : ValidValue extends string[]
      ? 'multiple'
      : ExplicitType extends 'single'
        ? 'single'
        : ExplicitType extends 'multiple'
          ? 'multiple'
          : never

  /**
   * The controlled value of the active item(s).
   *
   * Use this when you need to control the state of the items. Can be binded with `v-model`
   */
  modelValue?: ValidValue

  /**
   * The default active value of the item(s).
   *
   * Use when you do not need to control the state of the item(s).
   */
  defaultValue?: ValidValue

}
