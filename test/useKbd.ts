import type { KbdKeys} from '@destyler/composition';
import {useKbd } from '@destyler/composition'

export function useTestKbd() {
  const kbd = useKbd()

  const initTestKbd: Record<KbdKeys, string> = Object.entries(kbd).reduce((acc, [key, value]) => {
    acc[key as KbdKeys] = `{${value}}`
    return acc
  }, {} as Record<KbdKeys, string>)

  return {
    ...initTestKbd,
    SHIFT_TAB: `{Shift>}{${kbd.TAB}}`,
  }
}
