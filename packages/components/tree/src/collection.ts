import { filePathToTree, type FilePathTreeNode, TreeCollection, type TreeCollectionOptions } from '@zag-js/collection'
import { ref } from '@zag-js/core'

export function collection<T>(options: TreeCollectionOptions<T>): TreeCollection<T> {
  return ref(new TreeCollection(options))
}

collection.empty = (): TreeCollection => {
  return ref(new TreeCollection({ rootNode: { children: [] } }))
}

export function filePathCollection(paths: string[]): TreeCollection<FilePathTreeNode> {
  return ref(filePathToTree(paths))
}
