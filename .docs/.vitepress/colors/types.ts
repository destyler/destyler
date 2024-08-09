import type { DeepPartial } from 'unocss'

import type { Theme as STheme, ThemeCSSVarsVariant } from './themes'

export type ThemeColor = STheme['name']

type ArrayOrSingle<T> = T | T[]

export type ColorOptions =
  | ThemeColor
  | ThemeCSSVarsVariant
  | ({ base: ThemeColor } & DeepPartial<ThemeCSSVarsVariant>)

export interface ThemeOptions {
  /**
   * @default 'zinc'
   */
  color?: ColorOptions | false
  /**
   * @default 0.5
   */
  radius?: number | false
  /**
   * @default '.dark'
   */
  darkSelector?: string
}

export type PresetOptions = ArrayOrSingle<ThemeOptions>
