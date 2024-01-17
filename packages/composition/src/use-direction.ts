import type { Direction } from '@destyler/shared'
import { type Ref, computed } from 'vue'

export function useDirection(dir?: Ref<Direction | undefined>) {
  return computed(() => dir?.value || 'ltr')
}
