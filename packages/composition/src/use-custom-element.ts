import { unrefElement } from '@destyler/shared'
import { type ComponentPublicInstance, computed, ref } from 'vue'

export function useCustomElement() {
  const customElement = ref<ComponentPublicInstance>()
  const currentElement = computed<HTMLElement>(() => ['#text', '#comment'].includes(customElement.value?.$el.nodeName) ? customElement.value?.$el.nextElementSibling : unrefElement(customElement))

  return {
    customElement,
    currentElement,
  }
}
