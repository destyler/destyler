import type { Ref } from 'vue'
import { ref } from 'vue'

export const selected = ref<string>('')

export function useAccordionSelected(): Ref<string> {
  return selected
}
