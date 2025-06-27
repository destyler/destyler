import type {CollectionItem, CollectionOptions} from '@destyler/collection';
import {   ListCollection } from '@destyler/collection'
import { ref } from '@destyler/xstate'

export function collection<T extends CollectionItem>(options: CollectionOptions<T>): ListCollection<T> {
  return ref(new ListCollection(options))
}

collection.empty = (): ListCollection<CollectionItem> => {
  return ref(new ListCollection<CollectionItem>({ items: [] }))
}
