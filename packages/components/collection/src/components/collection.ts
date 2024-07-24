import { type Ref, computed, defineComponent, getCurrentInstance, h, markRaw, ref, watch, watchEffect } from 'vue'
import { createContext } from '@destyler/shared'
import { Slot } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'

// eslint-disable-next-line ts/ban-types
interface CollectionContext<ItemData = {}> {
  collectionRef: Ref<HTMLElement | undefined>
  itemMap: Ref<Map<HTMLElement, { ref: HTMLElement } & ItemData>>
  attrName: string
}

const ITEM_DATA_ATTR = 'data-destyler-collection-item'

export const [injectCollectionContext, provideCollectionContext] = createContext<CollectionContext>('CollectionProvider')

// eslint-disable-next-line ts/ban-types
export function createCollection<ItemData = {}>(attrName = ITEM_DATA_ATTR) {
  const itemMap = ref<Map<HTMLElement, { ref: HTMLElement } & ItemData>>(new Map())
  const collectionRef = ref<HTMLElement>()
  const context = provideCollectionContext({
    collectionRef,
    itemMap,
    attrName,
  }) as CollectionContext<ItemData>
  const { getItems } = useCollection(context)

  const reactiveItems = computed(() => Array.from(context.itemMap.value.values()))
  const itemMapSize = computed(() => context.itemMap.value.size)
  return { getItems, reactiveItems, itemMapSize }
}

export const CollectionSlot = defineComponent({
  name: 'DestylerCollectionSlot',
  setup(_) {
    const context = injectCollectionContext()
    const { customElement, currentElement } = useCustomElement()
    watch(currentElement, () => {
      context.collectionRef.value = currentElement.value
    })
    return {
      customElement,
    }
  },
  render() {
    return h(Slot, {
      ref: 'customElement',
    }, () => this.$slots.default?.())
  },
})

export const CollectionItem = defineComponent({
  name: 'DestylerCollectionItem',
  setup(_) {
    const context = injectCollectionContext()
    const { customElement, currentElement } = useCustomElement()
    const vm = getCurrentInstance()

    watchEffect((cleanupFn) => {
      if (currentElement.value) {
        const key = markRaw(currentElement.value)
        context.itemMap.value.set(key, { ref: currentElement.value!, ...(markRaw(vm?.parent?.props ?? {})) })
        cleanupFn(() => context.itemMap.value.delete(key))
      }
    })

    return {
      customElement,
      context,
    }
  },
  render() {
    return h(Slot, {
      ref: 'customElement',
      [this.context.attrName]: '',
      ...this.$attrs,
    }, () => this.$slots.default?.())
  },
})

// eslint-disable-next-line ts/ban-types
export function useCollection<ItemData = {}>(fallback?: CollectionContext<ItemData>) {
  const context = fallback ?? injectCollectionContext() as CollectionContext<ItemData>

  const getItems = () => {
    const collectionNode = context.collectionRef.value
    if (!collectionNode)
      return []
    const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${context.attrName}]`))
    const items = Array.from(context.itemMap.value.values())
    const orderedItems = items.sort(
      (a, b) => orderedNodes.indexOf(a.ref) - orderedNodes.indexOf(b.ref),
    )
    return orderedItems
  }

  return { getItems }
}
