import type { FilePathTreeNode, TreeCollectionOptions } from '@destyler/collection'
import { filePathToTree, TreeCollection } from '@destyler/collection'
import { ref } from '@destyler/xstate'

export function collection<T>(options: TreeCollectionOptions<T>): TreeCollection<T> {
  return ref(new TreeCollection(options))
}

collection.empty = (): TreeCollection => {
  return ref(new TreeCollection({ rootNode: { children: [] } }))
}

export function filePathCollection(paths: string[]): TreeCollection<FilePathTreeNode> {
  return ref(filePathToTree(paths))
}
