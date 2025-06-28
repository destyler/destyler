import type { Locale } from './locale'
import { getWindow } from '@destyler/dom'
import { getDefaultLocale } from './locale'

export interface LocaleOptions {
  locale?: string | undefined
  getRootNode?: (() => ShadowRoot | Document | Node) | undefined
  onLocaleChange?: ((locale: Locale) => void) | undefined
}

export function trackLocale(options: LocaleOptions = {}) {
  const { getRootNode, onLocaleChange } = options

  onLocaleChange?.(getDefaultLocale())

  const handleLocaleChange = () => {
    onLocaleChange?.(getDefaultLocale())
  }

  const win = getRootNode ? getWindow(getRootNode()) : window

  win.addEventListener('languagechange', handleLocaleChange)

  return () => {
    win.removeEventListener('languagechange', handleLocaleChange)
  }
}
