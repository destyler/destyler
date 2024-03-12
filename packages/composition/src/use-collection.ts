import { unrefElement } from '@destyler/shared'
import {
  type InjectionKey,
  type Ref,
  inject,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  provide,
  ref,
  watch,
} from 'vue'

const ITEM_DATA_ATTR = 'data-destyler-collection-item'

type ContextValue = Ref<HTMLElement[]>

export function useCollection(key?: string, name = ITEM_DATA_ATTR) {
  // eslint-disable-next-line symbol-description
  const COLLECTION_SYMBOL = key ?? (Symbol() as InjectionKey<ContextValue>)

  const createCollection = (sourceRef?: Ref<HTMLElement | undefined>) => {
    const items = ref([]) as Ref<HTMLElement[]> // ref<HTMLElement[]> is causing type inference issue

    function setCollection() {
      const sourceEl = unrefElement(sourceRef)
      if (!sourceEl)
        return (items.value = [])

      return (items.value = Array.from(
        sourceEl.querySelectorAll(`[${name}]:not([data-disabled=true])`),
      ) as HTMLElement[])
    }

    onBeforeUpdate(() => {
      items.value = []
    })

    onMounted(setCollection)
    onUpdated(setCollection)

    watch(() => sourceRef?.value, setCollection, { immediate: true })

    provide(COLLECTION_SYMBOL, items)

    return items
  }

  const injectCollection = () => {
    return inject(COLLECTION_SYMBOL, ref([]))
  }

  return { createCollection, injectCollection }
}
