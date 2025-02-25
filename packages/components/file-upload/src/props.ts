import type { ItemProps, UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'accept',
  'allowDrop',
  'capture',
  'dir',
  'directory',
  'disabled',
  'getRootNode',
  'id',
  'ids',
  'locale',
  'maxFiles',
  'maxFileSize',
  'minFileSize',
  'name',
  'invalid',
  'onFileAccept',
  'onFileReject',
  'onFileChange',
  'preventDocumentDrop',
  'required',
  'translations',
  'validate',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const itemProps = createProps<ItemProps>()(['file'])
export const splitItemProps = createSplitProps<ItemProps>(itemProps)
